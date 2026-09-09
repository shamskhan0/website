-- ============================================================
-- FIX: "mime type image/jpeg is not supported" upload error
-- Cause: 'media' bucket ki allowed-mimetypes list mein image/jpeg
--        nahi hai, is liye Supabase JPG upload reject kar deta hai.
-- Fix:   bucket ki allowed MIME types ko update karo (null = all
--        common image types explicitly allow).
-- ============================================================

update storage.buckets
set allowed_mime_types = array[
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif'
]
where id = 'media';

-- Verify (yeh row dikhani chahiye updated list ke saath):
-- select id, allowed_mime_types from storage.buckets where id = 'media';

-- ============================================================
-- Alternative: agar aap kisi bhi MIME type ko allow karna chahte
-- ho (bucket pe koi restriction nahi), to allowed_mime_types ko
-- NULL kar do:
--
-- update storage.buckets set allowed_mime_types = null where id = 'media';
-- ============================================================
