import { readCloudData, readCloudValue, subscribeCloudData, writeCloudValue, cloudStorageEnabled } from './firebase'

export const cloudSyncEnabled = cloudStorageEnabled

export async function fetchCloudSettings<T>(): Promise<T | null> {
  return readCloudValue<T>('site_settings')
}

export async function pushCloudSettings(settings: unknown): Promise<boolean> {
  return writeCloudValue('site_settings', settings)
}

export async function fetchAllCloudBatch(): Promise<{
  settings: unknown | null
  features: unknown | null
  news: unknown | null
  apk_versions: unknown | null
}> {
  const data = await readCloudData()
  return {
    settings: data.site_settings ?? null,
    features: data.features ?? null,
    news: data.news ?? null,
    apk_versions: data.apk_versions ?? null,
  }
}

export async function fetchCloudData<T>(key: string): Promise<T | null> {
  return readCloudValue<T>(key)
}

export async function pushCloudData(key: string, value: unknown): Promise<boolean> {
  return writeCloudValue(key, value)
}

export function onSettingsChanged(cb: () => void): () => void {
  const handler = (event: StorageEvent) => {
    if (event.key === 'rd_site_settings') cb()
  }
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}

export function subscribeToCloudChanges(cb: () => void): () => void {
  return subscribeCloudData(cb)
}
