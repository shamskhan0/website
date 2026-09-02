/**
 * Cloud Sync for Site Settings (images, announcement, hero text, etc.)
 *
 * Backed by Supabase — a single row in the `site_settings` table
 * (id = 1, `data` jsonb column) holds the whole settings object.
 *
 * One-time setup in the Supabase SQL Editor (Dashboard → SQL Editor):
 *
 *   create table if not exists site_settings (
 *     id int primary key default 1,
 *     data jsonb not null default '{}'::jsonb,
 *     updated_at timestamptz not null default now()
 *   );
 *   alter table site_settings enable row level security;
 *   create policy "read settings" on site_settings for select using (true);
 *   create policy "insert settings" on site_settings for insert with check (true);
 *   create policy "update settings" on site_settings for update using (true) with check (true);
 *   insert into site_settings (id) values (1) on conflict do nothing;
 *
 * If Supabase env vars are not configured, everything falls back to
 * localStorage-only mode (old behaviour) and nothing breaks.
 */

import { supabase, supabaseEnabled } from './supabase'

export const cloudSyncEnabled = supabaseEnabled;

/** Read settings from the cloud. Returns null on any failure. */
export async function fetchCloudSettings<T>(): Promise<T | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('data')
      .eq('id', 1)
      .maybeSingle();
    if (error) {
      console.error('fetchCloudSettings:', error.message);
      return null;
    }
    return (data?.data as T) ?? null;
  } catch {
    return null;
  }
}

/** Write settings to the cloud. Returns true on success. */
export async function pushCloudSettings(settings: unknown): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('site_settings').upsert({
      id: 1,
      data: settings,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      console.error('pushCloudSettings:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Generic key/value cloud storage (features, news, APK versions, etc.).
 * Stored as one row per key in the `cloud_data` table:
 *
 *   create table if not exists cloud_data (
 *     key text primary key,
 *     value jsonb not null,
 *     updated_at timestamptz not null default now()
 *   );
 *   alter table cloud_data enable row level security;
 *   create policy "read cloud_data" on cloud_data for select using (true);
 *   create policy "insert cloud_data" on cloud_data for insert with check (true);
 *   create policy "update cloud_data" on cloud_data for update using (true) with check (true);
 */

export async function fetchCloudData<T>(key: string): Promise<T | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('cloud_data')
      .select('value')
      .eq('key', key)
      .maybeSingle();
    if (error) {
      console.error(`fetchCloudData(${key}):`, error.message);
      return null;
    }
    return (data?.value as T) ?? null;
  } catch {
    return null;
  }
}

export async function pushCloudData(key: string, value: unknown): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('cloud_data').upsert({
      key,
      value,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      console.error(`pushCloudData(${key}):`, error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Listen for saves made in OTHER tabs/windows of this browser (admin panel
 * runs in a separate tab). When admin saves, localStorage is written and
 * this event fires — live site updates instantly without refresh.
 */
export function onSettingsChanged(cb: () => void): () => void {
  const handler = (e: StorageEvent) => {
    if (e.key === "rd_site_settings") cb();
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}
