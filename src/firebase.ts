import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getFirestore, collection, doc, getDocs, onSnapshot, setDoc } from 'firebase/firestore'
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? '',
}

const requiredFirebaseConfig = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.storageBucket,
  firebaseConfig.messagingSenderId,
  firebaseConfig.appId,
]
export const firebaseEnabled = requiredFirebaseConfig.every(Boolean)
const app = firebaseEnabled ? initializeApp(firebaseConfig) : null
export const auth = app ? getAuth(app) : null
export const firestore = app ? getFirestore(app) : null
export const storage = app ? getStorage(app) : null

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}
const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const MEDIA_COLLECTION = 'cloud_data'

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
      reject(new Error('The file is not a valid image.'))
    }
    img.src = url
  })
}

async function optimizeImage(file: File, img: HTMLImageElement): Promise<{ blob: Blob; format: string }> {
  if (file.type === 'image/webp' || file.type === 'image/avif' || file.type === 'image/gif') {
    return { blob: file, format: ALLOWED_IMAGE_TYPES[file.type] }
  }
  const maxDim = 1920
  const scale = Math.min(maxDim / img.naturalWidth, maxDim / img.naturalHeight, 1)
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(img.naturalWidth * scale))
  canvas.height = Math.max(1, Math.round(img.naturalHeight * scale))
  const context = canvas.getContext('2d')
  if (!context) return { blob: file, format: ALLOWED_IMAGE_TYPES[file.type] }
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(img, 0, 0, canvas.width, canvas.height)
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.82))
  if (!blob || blob.size >= file.size) return { blob: file, format: ALLOWED_IMAGE_TYPES[file.type] }
  return { blob, format: 'webp' }
}

export type UploadStage = 'validating' | 'optimizing' | 'uploading' | 'finalizing' | 'done'

function storageError(error: unknown): string {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : ''
  if (code.includes('unauthorized') || code.includes('unauthenticated')) return 'Permission denied. Firebase Storage rules require an admin login.'
  if (code.includes('quota')) return 'Firebase Storage quota exceeded.'
  if (code.includes('object-not-found')) return 'The Firebase Storage file was not found.'
  return error instanceof Error ? error.message : 'Firebase Storage request failed.'
}

export async function uploadImage(
  file: File,
  folder = 'images',
  onProgress?: (percent: number, stage: UploadStage) => void,
): Promise<{ url: string; path: string; width: number; height: number; format: string; size: number; version: number } | { error: string }> {
  if (!firebaseEnabled || !storage) return { error: 'Firebase is not configured. Add the VITE_FIREBASE_* values and redeploy.' }
  if (!auth?.currentUser) return { error: 'Firebase admin login required. Logout and login again before uploading.' }
  onProgress?.(5, 'validating')
  if (file.type === 'image/svg+xml') return { error: 'SVG files are not allowed. Please upload PNG, WebP or JPG.' }
  if (!ALLOWED_IMAGE_TYPES[file.type]) return { error: 'Unsupported image format. Allowed: JPG, PNG, WebP, GIF, AVIF.' }
  if (!file.size || file.size > MAX_IMAGE_BYTES) return { error: `Image must be between 1 byte and 10MB.` }
  let image: HTMLImageElement
  try {
    image = await decodeImage(file)
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Invalid image file.' }
  }
  onProgress?.(15, 'optimizing')
  let optimized: { blob: Blob; format: string }
  try {
    optimized = await optimizeImage(file, image)
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Image optimization failed.' }
  }
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${optimized.format}`
  const path = `${folder}/${safeName}`
  onProgress?.(30, 'uploading')
  try {
    const task = uploadBytesResumable(ref(storage, path), optimized.blob, { contentType: `image/${optimized.format === 'jpg' ? 'jpeg' : optimized.format}` })
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        task.cancel()
        reject(new Error('Upload timed out. Check Firebase Storage rules and your internet connection.'))
      }, 120000)
      task.on('state_changed', (snapshot) => onProgress?.(30 + Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 55), 'uploading'), (error) => {
        clearTimeout(timeout)
        reject(error)
      }, () => {
        clearTimeout(timeout)
        resolve()
      })
    })
    onProgress?.(90, 'finalizing')
    const url = await getDownloadURL(ref(storage, path))
    await loadWithRetry(url, 1)
    onProgress?.(100, 'done')
    return { url, path, width: image.naturalWidth, height: image.naturalHeight, format: optimized.format, size: optimized.blob.size, version: Date.now() }
  } catch (error) {
    await deleteObject(ref(storage, path)).catch(() => undefined)
    return { error: storageError(error) }
  }
}

export async function uploadFile(file: File, folder = 'apk', onProgress?: (percent: number) => void): Promise<{ url: string; path: string } | { error: string }> {
  if (!firebaseEnabled || !storage) return { error: 'Firebase is not configured. Add the VITE_FIREBASE_* values and redeploy.' }
  if (!auth?.currentUser) return { error: 'Firebase admin login required. Logout and login again before uploading.' }
  if (!file.size) return { error: 'The selected file is empty.' }
  if (file.size > 150 * 1024 * 1024) return { error: 'APK file is larger than the 150MB limit.' }
  const ext = file.name.includes('.') ? file.name.split('.').pop()!.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin' : 'bin'
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`
  try {
    const task = uploadBytesResumable(ref(storage, path), file, {
      contentType: file.type || 'application/vnd.android.package-archive',
      contentDisposition: `attachment; filename="${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}"`,
      cacheControl: 'public,max-age=3600',
    })
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        task.cancel()
        reject(new Error('Upload timed out. Check Firebase Storage rules and your internet connection.'))
      }, 120000)
      task.on('state_changed', (snapshot) => onProgress?.(Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 90)), (error) => {
        clearTimeout(timeout)
        reject(error)
      }, () => {
        clearTimeout(timeout)
        resolve()
      })
    })
    const url = await getDownloadURL(ref(storage, path))
    onProgress?.(100)
    return { url, path }
  } catch (error) {
    return { error: storageError(error) }
  }
}

export async function deleteImageByUrl(url: string): Promise<void> {
  if (!storage || !url) return
  try {
    await deleteObject(ref(storage, url))
  } catch {
    try { await deleteObject(ref(storage, decodeURIComponent(new URL(url).pathname.split('/o/')[1]?.split('?')[0] ?? '').replace(/^\//, ''))) } catch { /* best effort */ }
  }
}

export function loadWithRetry(src: string, retries = 2): Promise<string> {
  return new Promise((resolve, reject) => {
    const attempt = (remaining: number) => {
      const image = new Image()
      image.onload = () => resolve(src)
      image.onerror = () => remaining ? setTimeout(() => attempt(remaining - 1), 1000) : reject(new Error('Image failed to load'))
      image.src = src
    }
    attempt(retries)
  })
}

export async function signInAdmin(email: string, password: string) {
  if (!auth) return null
  try {
    return (await signInWithEmailAndPassword(auth, email, password)).user
  } catch {
    return null
  }
}

export async function signOutAdmin() {
  if (auth) await signOut(auth)
}

export async function readCloudData(): Promise<Record<string, unknown>> {
  if (!firestore) return {}
  const snapshot = await getDocs(collection(firestore, MEDIA_COLLECTION))
  return Object.fromEntries(snapshot.docs.map((item) => [item.id, item.data().value]))
}

export async function readCloudValue<T>(key: string): Promise<T | null> {
  const all = await readCloudData()
  return (all[key] as T) ?? null
}

export async function writeCloudValue(key: string, value: unknown): Promise<boolean> {
  if (!firestore) return false
  try {
    await setDoc(doc(firestore, MEDIA_COLLECTION, key), { value, updated_at: new Date().toISOString() })
    return true
  } catch (error) {
    console.error(`writeCloudValue(${key}):`, error)
    return false
  }
}

export function subscribeCloudData(onChange: () => void): () => void {
  if (!firestore) return () => undefined
  return onSnapshot(collection(firestore, MEDIA_COLLECTION), onChange, (error) => console.error('subscribeCloudData:', error))
}
