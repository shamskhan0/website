import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabaseEnabled = Boolean(supabaseUrl && supabaseAnonKey)

/**
 * Upload an image to the public `media` storage bucket and return its
 * public URL. Falls back to a base64 data-URL when Supabase is not
 * configured (so local-only mode keeps working).
 */
export async function uploadImage(file: File, folder = 'images'): Promise<string | null> {
  if (!supabase) {
    // Local fallback: base64 data URL (old behaviour)
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null)
      reader.readAsDataURL(file)
    })
  }
  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'bin'
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const path = `${folder}/${safeName}`
  const { error } = await supabase.storage
    .from('media')
    .upload(path, file, { cacheControl: '3600', upsert: false })
  if (error) {
    console.error('uploadImage:', error.message)
    return null
  }
  const { data } = supabase.storage.from('media').getPublicUrl(path)
  return data.publicUrl
}

/**
 * Shared Supabase client. The publishable (anon) key is safe to expose in the
 * browser as long as Row Level Security (RLS) is enabled on your tables.
 * The secret key must NEVER be used here or committed anywhere.
 */
export const supabase = supabaseEnabled
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null
