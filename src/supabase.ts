import { createClient } from '@supabase/supabase-js'

// Supabase configuration must come from the deployment environment. Never ship
// a project URL or publishable key fallback in source control or the bundle.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export const supabaseEnabled = Boolean(supabaseUrl && supabaseAnonKey)

export const MEDIA_BUCKET = 'media'

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}

// NOTE: SVG deliberately removed — SVG can carry embedded scripts (XSS vector)
// and is not safe to accept from an unauthenticated-adjacent upload UI.
// Use PNG/WebP for logos; they preserve transparency and are safer.

const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // 10MB (pre-optimization limit)

/**
 * Decode a File into an HTMLImageElement, enforcing real decodability.
 * This is a content-level check: a .jpg renamed from an HTML/exe file will
 * fail to decode and be rejected even though the browser-reported MIME looked
 * like an image. Rejects SVG (never instantiated as <img> source here).
 */
function decodeImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    const cleanup = () => URL.revokeObjectURL(url)
    img.onload = () => {
      if (!img.naturalWidth || !img.naturalHeight) {
        cleanup()
        reject(new Error('The file is not a decodable image.'))
        return
      }
      cleanup()
      resolve(img)
    }
    img.onerror = () => {
      cleanup()
      reject(new Error('The file is not a valid image (or the format is unsupported by this browser).'))
    }
    img.src = url
  })
}

/**
 * Client-side optimization pipeline (the Vite deployment is static — there is
 * no Node/Sharp server available, so optimization happens in the browser with
 * Canvas before upload):
 *  - auto-corrects EXIF orientation (browsers apply it during drawImage)
 *  - downscales anything larger than maxDim while preserving aspect ratio
 *  - re-encodes JPEG/PNG to WebP (quality 82) — typically 60-90% smaller
 *  - WebP/AVIF/GIF inputs are passed through untouched (already optimized or animated)
 * Returns a Blob ready for upload plus the final format.
 */
async function optimizeImage(file: File, img: HTMLImageElement): Promise<{ blob: Blob; format: string }> {
  const passthrough = file.type === 'image/webp' || file.type === 'image/avif' || file.type === 'image/gif'
  const MAX_DIM = 1920

  if (passthrough) {
    return { blob: file, format: ALLOWED_IMAGE_TYPES[file.type] }
  }

  const needsResize = img.naturalWidth > MAX_DIM || img.naturalHeight > MAX_DIM
  const scale = needsResize
    ? Math.min(MAX_DIM / img.naturalWidth, MAX_DIM / img.naturalHeight, 1)
    : 1
  const width = Math.max(1, Math.round(img.naturalWidth * scale))
  const height = Math.max(1, Math.round(img.naturalHeight * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return { blob: file, format: ALLOWED_IMAGE_TYPES[file.type] }
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  // drawImage of a File-backed <img> applies EXIF orientation in all modern browsers
  ctx.drawImage(img, 0, 0, width, height)

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/webp', 0.82),
  )

  // Fall back to the original file if WebP encoding is unsupported (very old browsers)
  if (!blob) return { blob: file, format: ALLOWED_IMAGE_TYPES[file.type] }

  // Never make the file BIGGER than the original — keep the source if so.
  if (blob.size >= file.size) return { blob: file, format: ALLOWED_IMAGE_TYPES[file.type] }

  return { blob, format: 'webp' }
}

/**
 * Load an image URL with a bounded retry (max `retries` extra attempts) —
 * handles transient network/CDN blips without infinite retry loops.
 */
export function loadWithRetry(src: string, retries = 2): Promise<string> {
  return new Promise((resolve, reject) => {
    const attempt = (remaining: number) => {
      const img = new Image()
      img.onload = () => resolve(src)
      img.onerror = () => {
        if (remaining > 0) {
          setTimeout(() => attempt(remaining - 1), 1000)
        } else {
          reject(new Error('Image failed to load'))
        }
      }
      img.src = src
    }
    attempt(retries)
  })
}

/**
 * Classify any Supabase upload/DB failure into a user-friendly message.
 * Never prints keys or secrets — only the API's own error message.
 */
function describeSupabaseError(error: { message?: string } | null | undefined): string {
  const raw = error?.message ?? 'Unknown error'
  const msg = raw.toLowerCase()
  if (msg.includes('row-level security') || msg.includes('42501') || msg.includes('permission')) {
    return 'Permission denied — Supabase RLS policy / storage policy is blocking this operation.'
  }
  if (msg.includes('bucket not found') || msg.includes('the resource was not found')) {
    return `Storage bucket "${MEDIA_BUCKET}" not found — create it in Supabase Dashboard → Storage.`
  }
  if (msg.includes('duplicate')) {
    return 'A file with the same name already exists. Please retry the upload.'
  }
  if (msg.includes('mime type') && msg.includes('not supported')) {
    return `Storage bucket rejected this file type: ${raw}. Open Supabase Dashboard → Storage → media bucket → Settings and add this MIME type to "Allowed MIME types" (see FIX_MIME_TYPE.sql).`
  }
  if (msg.includes('invalid') && msg.includes('jwt')) {
    return 'Authentication failed — check the Supabase project URL and publishable key.'
  }
  if (msg.includes('failed to fetch') || msg.includes('network')) {
    return 'Network error — check your internet connection and try again.'
  }
  return raw
}

/**
 * Upload an image to the public `media` storage bucket and return its
 * permanent public URL (works in every browser / device, not just the
 * one that uploaded it). No base64 / blob / localStorage fallback — if
 * Supabase is not configured the caller must show an error instead of
 * saving a browser-only URL into the database.
 */
export type UploadStage = 'validating' | 'optimizing' | 'uploading' | 'finalizing' | 'done'

export async function uploadImage(
  file: File,
  folder = 'images',
  onProgress?: (percent: number, stage: UploadStage) => void,
): Promise<
  | { url: string; path: string; width: number; height: number; format: string; size: number; version: number }
  | { error: string }
> {
  if (!supabase) {
    console.error('[v0] Supabase upload unavailable: public client configuration was not embedded in the production bundle.')
    return { error: 'Supabase upload is unavailable in this deployment. Please redeploy the latest version.' }
  }
  onProgress?.(5, 'validating')

  // --- Validation: MIME allow-list + size limit + real decodability check ---
  if (file.type === 'image/svg+xml') {
    return { error: 'SVG files are not allowed for security reasons. Please upload a PNG, WebP or JPG instead.' }
  }
  if (!ALLOWED_IMAGE_TYPES[file.type]) {
    return { error: 'Unsupported image format. Allowed: JPG, PNG, WebP, GIF, AVIF.' }
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 10MB.` }
  }
  if (file.size === 0) {
    return { error: 'The selected file is empty.' }
  }

  let img: HTMLImageElement
  try {
    img = await decodeImage(file)
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Invalid image file.' }
  }

  // --- Optimization: downscale + WebP re-encode (browser Canvas pipeline) ---
  onProgress?.(15, 'optimizing')
  let payload: Blob = file
  let format = ALLOWED_IMAGE_TYPES[file.type]
  try {
    const optimized = await optimizeImage(file, img)
    payload = optimized.blob
    format = optimized.format
  } catch {
    // Optimization is best-effort: fall back to the validated original.
  }

  if (payload.size > MAX_IMAGE_BYTES) {
    return { error: 'Image is too large even after optimization. Please use a smaller image.' }
  }

  const ext = format
  // Unique, safe, cache-proof filename — the same name is never reused, so a
  // replaced image always gets a fresh URL (no stale-cache problem).
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`
  const path = `${folder}/${safeName}`

  onProgress?.(30, 'uploading')
  // Immutable 1-year cache is safe: content is unique per path.
  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, payload, { cacheControl: '31536000', upsert: false, contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}` })
  if (error) {
    console.error('uploadImage:', error.message)
    return { error: describeSupabaseError(error) }
  }
  onProgress?.(85, 'finalizing')

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)
  if (!data?.publicUrl) {
    // Orphaned file cleanup — never leave a file behind with no DB reference.
    await supabase.storage.from(MEDIA_BUCKET).remove([path]).catch(() => undefined)
    return { error: 'Upload succeeded but public URL could not be generated. Is the bucket public?' }
  }

  // Sanity-check the final URL before the caller saves anything to the DB.
  // A broken/temporary URL must never reach the database.
  const url = data.publicUrl
  if (!/^https:\/\//.test(url) || url.startsWith('blob:') || url.includes('localhost')) {
    await supabase.storage.from(MEDIA_BUCKET).remove([path]).catch(() => undefined)
    return { error: 'Generated URL is not a valid permanent URL. Upload aborted.' }
  }

  // Verify the uploaded object is actually served (guards against RLS/policy
  // issues where upload succeeds but public read fails → broken images).
  try {
    await loadWithRetry(url, 1)
  } catch {
    await supabase.storage.from(MEDIA_BUCKET).remove([path]).catch(() => undefined)
    return { error: 'Upload completed but the image cannot be served publicly. Check the bucket read policy.' }
  }

  onProgress?.(100, 'done')
  return {
    url,
    path,
    width: img.naturalWidth,
    height: img.naturalHeight,
    format,
    size: payload.size,
    version: Date.now(), // used by the UI as a cache-busting ?v= value
  }
}

/**
 * Upload any binary file (APK, ZIP, etc.) to the public `media` bucket.
 * APK files ko 'apk/' folder mein rakhta hai. Returns permanent public URL.
 */
export async function uploadFile(
  file: File,
  folder = 'apk',
  onProgress?: (percent: number) => void,
): Promise<{ url: string; path: string } | { error: string }> {
  if (!supabase) {
    return { error: 'Supabase is not configured — deployment issue, please redeploy.' }
  }
  if (file.size === 0) {
    return { error: 'The selected file is empty.' }
  }
  const MAX_FILE_BYTES = 150 * 1024 * 1024 // 150MB
  if (file.size > MAX_FILE_BYTES) {
    return { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 150MB.` }
  }

  const ext = file.name.includes('.') ? file.name.split('.').pop()!.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin' : 'bin'
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`
  const path = `${folder}/${safeName}`

  onProgress?.(10)
  // Try primary APK MIME type first. If the Supabase bucket restricts allowed_mime_types
  // and rejects application/vnd.android.package-archive, automatically fallback to
  // common allowed types ('application/octet-stream' or omitting contentType) so the upload succeeds.
  const contentTypesToTry = [
    'application/vnd.android.package-archive',
    'application/octet-stream',
    'application/x-zip-compressed',
    'binary/octet-stream',
  ]

  let uploadError: { message?: string } | null = null

  for (const ct of contentTypesToTry) {
    const res = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(path, file, { upsert: false, contentType: ct })

    if (!res.error) {
      uploadError = null
      break
    }

    uploadError = res.error
    // If the error is NOT a mime type restriction, break early (e.g. auth or size error)
    if (!res.error.message?.toLowerCase().includes('mime type')) {
      break
    }
  }

  // Final attempt without explicit contentType header if all specific MIME types failed
  if (uploadError && uploadError.message?.toLowerCase().includes('mime type')) {
    const finalRes = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(path, file, { upsert: false })
    if (!finalRes.error) {
      uploadError = null
    } else {
      uploadError = finalRes.error
    }
  }

  if (uploadError) {
    console.error('uploadFile:', uploadError.message)
    return { error: describeSupabaseError(uploadError) }
  }
  onProgress?.(80)
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)
  if (!data?.publicUrl) {
    await supabase.storage.from(MEDIA_BUCKET).remove([path]).catch(() => undefined)
    return { error: 'Upload succeeded but URL generation failed. Is the bucket public?' }
  }
  onProgress?.(100)
  return { url: data.publicUrl, path }
}

/**
 * Delete an image from the `media` bucket given its full public URL.
 * Best-effort: failures are logged but never block the DB update.
 */
export async function deleteImageByUrl(url: string): Promise<void> {
  if (!supabase || !url) return
  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return // not a media-bucket URL (e.g. bundled fallback) — nothing to delete
  const path = url.slice(idx + marker.length).split('?')[0]
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path])
  if (error) console.error('deleteImageByUrl:', error.message)
}

/**
 * Shared Supabase client. The publishable (anon) key is safe to expose in the
 * browser as long as Row Level Security (RLS) is enabled on your tables.
 * The secret key must NEVER be used here or committed anywhere.
 */
export const supabase = supabaseEnabled
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null
