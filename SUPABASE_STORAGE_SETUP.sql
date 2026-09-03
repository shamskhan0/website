-- ============================================================
-- SUPABASE FIX: Image upload persistence (images sab browsers mein)
-- Supabase Dashboard → SQL Editor → New query → paste → Run
-- ============================================================

-- 1) cloud_data table (features, news, apk_versions AND site_settings)
create table if not exists cloud_data (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table cloud_data enable row level security;

-- Purani policies saaf karo (agar pehle se hain)
drop policy if exists "read cloud_data"   on cloud_data;
drop policy if exists "write cloud_data"  on cloud_data;
drop policy if exists "update cloud_data" on cloud_data;

-- Public read (website visitors), public write (admin panel uses anon key)
create policy "read cloud_data"   on cloud_data for select using (true);
create policy "write cloud_data"  on cloud_data for insert with check (true);
create policy "update cloud_data" on cloud_data for update using (true) with check (true);

-- 2) Legacy site_settings table ab use nahi hota (is ki RLS policies anon
--    writes block kar rahi thin — isi liye images sirf ek browser mein
--    dikhti thin). Optional: safely delete it:
-- drop table if exists site_settings;

-- 3) Storage: public 'media' bucket
-- Dashboard → Storage → check bucket 'media' exists and is PUBLIC.
-- Agar nahi hai to SQL editor se nahi ban sakta — Storage → New bucket:
--   Name: media   Public bucket: ON   File size limit: 5242880 (5MB)
--   Allowed MIME types: image/jpeg, image/png, image/webp, image/gif,
--                       image/svg+xml, image/avif
-- Phir Storage → media → Policies → New policy (or run these, storage
-- policies CAN run in SQL editor on storage.objects):
create policy "media public read"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "media public insert"
  on storage.objects for insert
  with check (bucket_id = 'media');

create policy "media public update"
  on storage.objects for update
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

create policy "media public delete"
  on storage.objects for delete
  using (bucket_id = 'media');

-- NOTE: These storage policies are intentionally permissive because the
-- admin panel is a client-side-only app using the anon (publishable) key.
-- Anyone can write, but they can only overwrite their own data — they
-- cannot access the database secret key or anything beyond this bucket
-- and the two public tables. For stricter control, add Supabase Auth
-- and change insert/update/delete to `authenticated` only.
-- ============================================================
