/**
 * Cloud Sync for Site Settings (images, announcement, hero text, etc.)
 *
 * Backed by Supabase — the whole settings object is stored as one JSONB
 * row in the `cloud_data` table under the key `site_settings`:
 *
 *   create table if not exists cloud_data (
 *     key text primary key,
 *     value jsonb not null,
 *     updated_at timestamptz not null default now()
 *   );
 *   alter table cloud_data enable row level security;
 *   create policy "read cloud_data" on cloud_data for select using (true);
 *   -- INSERT/UPDATE policies must target an authenticated admin role and
 *   -- enforce authorization; never use `using (true)` for public writes.
 *
 * NOTE: the legacy `site_settings` table is no longer used. The `cloud_data`
 * table must be protected with authenticated write policies in Supabase; this
 * browser client intentionally uses only the publishable key and cannot bypass
 * RLS. Public reads may be allowed, but unauthenticated writes are unsafe.
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
      .from('cloud_data')
      .select('value')
      .eq('key', 'site_settings')
      .maybeSingle();
    if (error) {
      console.error('fetchCloudSettings:', error.message);
      return null;
    }
    return (data?.value as T) ?? null;
  } catch {
    return null;
  }
}

/** Write settings to the cloud. Returns true on success. */
export async function pushCloudSettings(settings: unknown): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('cloud_data').upsert({
      key: 'site_settings',
      value: settings,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      console.error('pushCloudSettings:', error.message);
      return false;
    }
    queryCache.clear()
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

// In-memory request deduplication cache
const queryCache = new Map<string, { promise: Promise<any>; timestamp: number }>()
const CACHE_TTL_MS = 60_000 // 1 minute in-memory TTL

export async function fetchAllCloudBatch(): Promise<{
  settings: unknown | null
  features: unknown | null
  news: unknown | null
  apk_versions: unknown | null
}> {
  if (!supabase) {
    return { settings: null, features: null, news: null, apk_versions: null }
  }

  const cacheKey = 'batch_all'
  const cached = queryCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.promise
  }

  const promise = (async () => {
    try {
      const { data, error } = await supabase
        .from('cloud_data')
        .select('key, value')
        .in('key', ['site_settings', 'features', 'news', 'apk_versions'])

      if (error || !data) {
        if (error) console.error('fetchAllCloudBatch error:', error.message)
        return { settings: null, features: null, news: null, apk_versions: null }
      }

      const map = new Map<string, unknown>()
      for (const row of data) {
        map.set(row.key, row.value)
      }

      return {
        settings: map.get('site_settings') ?? null,
        features: map.get('features') ?? null,
        news: map.get('news') ?? null,
        apk_versions: map.get('apk_versions') ?? null,
      }
    } catch (e) {
      console.error('fetchAllCloudBatch exception:', e)
      return { settings: null, features: null, news: null, apk_versions: null }
    }
  })()

  queryCache.set(cacheKey, { promise, timestamp: Date.now() })
  return promise
}

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
    queryCache.clear()
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
    if (e.key === 'rd_site_settings') cb()
  }
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}

/**
 * Notify open visitor tabs whenever any shared content row changes. Realtime
 * is the primary path; the visibility listener is a safe fallback for devices
 * that sleep WebSocket connections while the page is backgrounded.
 */
export function subscribeToCloudChanges(cb: () => void): () => void {
  if (!supabase) return () => undefined

  let refreshTimer: ReturnType<typeof setTimeout> | undefined
  const scheduleRefresh = () => {
    if (refreshTimer) clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => {
      queryCache.clear()
      cb()
    }, 150)
  }

  const channel = supabase
    .channel('public:cloud_data:site-content')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'cloud_data',
    }, scheduleRefresh)
    .subscribe()

  const onVisible = () => {
    if (document.visibilityState === 'visible') scheduleRefresh()
  }
  document.addEventListener('visibilitychange', onVisible)

  return () => {
    if (refreshTimer) clearTimeout(refreshTimer)
    document.removeEventListener('visibilitychange', onVisible)
    void supabase?.removeChannel(channel)
  }
}
