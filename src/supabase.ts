import { createClient } from '@supabase/supabase-js'

const env = import.meta.env as ImportMetaEnv & Record<string, string | undefined>
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY

export const supabaseEnabled = Boolean(supabaseUrl && supabaseAnonKey)

export const MEDIA_BUCKET = 'media'

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'image/avif': 'avif',
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5MB

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
export async function uploadImage(
  file: File,
  folder = 'images',
  onProgress?: (percent: number) => void,
): Promise<{ url: string; path: string } | { error: string }> {
  if (!supabase) {
    return { error: 'Supabase is not configured. Add the project URL and publishable key to the app environment.' }
  }
  if (!file.type.startsWith('image/')) {
    return { error: 'Invalid file type. Please upload a JPG, PNG, WebP, GIF or SVG image.' }
  }
  const ext = ALLOWED_IMAGE_TYPES[file.type]
  if (!ext) {
    return { error: 'Unsupported image format. Allowed: JPG, PNG, WebP, GIF, SVG, AVIF.' }
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 5MB.` }
  }
  if (file.size === 0) {
    return { error: 'The selected file is empty.' }
  }

  // Unique filename -> collision-proof, cache-safe (same name never reused)
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`
  const path = `${folder}/${safeName}`

  onProgress?.(10)
  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { cacheControl: '31536000', upsert: false, contentType: file.type })
  if (error) {
    console.error('uploadImage:', error.message)
    return { error: describeSupabaseError(error) }
  }
  onProgress?.(80)

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)
  if (!data?.publicUrl) {
    // Orphaned file cleanup — never leave a file behind with no DB reference.
    await supabase.storage.from(MEDIA_BUCKET).remove([path]).catch(() => undefined)
    return { error: 'Upload succeeded but public URL could not be generated. Is the bucket public?' }
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
