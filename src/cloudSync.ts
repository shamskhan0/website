/**
 * Cloud Sync for Site Settings (images, announcement, hero text, etc.)
 *
 * Uses https://jsonblob.com — a free, zero-setup JSON storage API.
 * The blob ID is stored in .env (VITE_CLOUD_BLOB_ID) and baked into the
 * build. Every visitor fetches settings from the cloud, so when the admin
 * saves, ALL users see the change after a page refresh (and the admin
 * panel broadcasts instantly to open tabs via a storage event).
 *
 * To set up once:
 *   1. POST {} to https://jsonblob.com/api/jsonBlob
 *      → response header "Location" contains the new blob URL.
 *      The last URL segment is the blob id, e.g. 1234567890123456789
 *   2. Put that id in .env:  VITE_CLOUD_BLOB_ID=1234567890123456789
 *
 * Base64 data-URL images are stored inline in the blob (this is how the
 * admin uploads work today). jsonblob accepts large bodies (~1MB+), so
 * keep each image under ~700KB for reliable sync. If no blob id is
 * configured, everything falls back to localStorage-only mode (old
 * behaviour) and nothing breaks.
 */

const BLOB_ID = import.meta.env.VITE_CLOUD_BLOB_ID as string | undefined;
const API = BLOB_ID ? `https://jsonblob.com/api/jsonBlob/${BLOB_ID}` : "";

export const cloudSyncEnabled = Boolean(BLOB_ID);

/** Read settings from the cloud. Returns null on any failure. */
export async function fetchCloudSettings<T>(): Promise<T | null> {
  if (!API) return null;
  try {
    const res = await fetch(API, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const data = (await res.json()) as T | null;
    return data;
  } catch {
    return null;
  }
}

/** Write settings to the cloud. Returns true on success. */
export async function pushCloudSettings(settings: unknown): Promise<boolean> {
  if (!API) return false;
  try {
    const res = await fetch(API, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(settings),
    });
    return res.ok;
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
