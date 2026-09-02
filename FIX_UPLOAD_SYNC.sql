-- ============================================================
-- FIX: Image uploads sirf apne browser mein dikh rahi thin
-- Problem: 'site_settings' table ki RLS policies galat thin
-- ============================================================

-- 1. Purani (galat) policies hatao
drop policy if exists "insert settings" on site_settings;
drop policy if exists "update settings" on site_settings;
drop policy if exists "read settings"  on site_settings;

-- 2. RLS enable rakho (zaroori hai security ke liye)
alter table site_settings enable row level security;

-- 3. Sahi policies banao — anon (public) key se read + write dono allowed
create policy "read settings"
  on site_settings for select
  using (true);

create policy "write settings"
  on site_settings for insert
  with check (true);

create policy "update settings"
  on site_settings for update
  using (true)
  with check (true);

-- 4. Default settings row banao (agar pehle se nahi hai)
insert into site_settings (id) values (1) on conflict do nothing;

-- ============================================================
-- cloud_data table bhi safe side pe rakho (already OK tha)
-- ============================================================
drop policy if exists "read cloud_data"   on cloud_data;
drop policy if exists "write cloud_data"  on cloud_data;
drop policy if exists "update cloud_data" on cloud_data;

alter table cloud_data enable row level security;

create policy "read cloud_data"
  on cloud_data for select
  using (true);

create policy "write cloud_data"
  on cloud_data for insert
  with check (true);

create policy "update cloud_data"
  on cloud_data for update
  using (true)
  with check (true);

-- ============================================================
-- media storage bucket — public read + anon write
-- (agar pehle se sahi hai to yeh kuch nahi bigdega)
-- ============================================================
-- Storage policies SQL editor se nahi, dashboard se set hoti hain.
-- Dashboard → Storage → media bucket → Policies:
--   SELECT (read):   allow for anon, authenticated  → true
--   INSERT (upload): allow for anon, authenticated  → true
--   UPDATE:          allow for anon, authenticated  → true
--   DELETE:          allow for anon, authenticated  → true
-- ============================================================
