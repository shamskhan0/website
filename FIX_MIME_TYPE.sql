-- ============================================================
-- FIX: "mime type ... is not supported" in Supabase Storage
-- Cause: 'media' bucket has restricted allowed_mime_types configured.
--
-- RECOMMENDED PERMANENT FIX:
-- Remove all MIME type restrictions on the 'media' bucket so it accepts
-- APK files ('application/vnd.android.package-archive'), all images, and
-- binary packages without throwing 400 errors:
--
-- Run this in Supabase Dashboard → SQL Editor → Run:
-- ============================================================

update storage.buckets
set allowed_mime_types = null
where id = 'media';

-- Verify (should show allowed_mime_types as null):
select id, name, public, allowed_mime_types from storage.buckets where id = 'media';

-- ============================================================
-- Alternative (if you prefer an explicit whitelist):
--
-- update storage.buckets
-- set allowed_mime_types = array[
--   'image/jpeg',
--   'image/png',
--   'image/webp',
--   'image/gif',
--   'image/avif',
--   'application/vnd.android.package-archive',
--   'application/octet-stream'
-- ]
-- where id = 'media';
-- ============================================================
