/**
 * Robust APK download helper.
 *
 * Problem ye thi ke download button `/roshan-digital-v2.0.0.apk` par point
 * karta tha jabke wo file exist nahi karti — SPA fallback ki wajah se server
 * index.html bhej deta tha aur user ko HTML file download hoti thi.
 *
 * Ye helper:
 *  1. APK URL ko fetch karta hai
 *  2. Check karta hai ke response sach mein APK/binary hai (HTML nahi)
 *  3. Blob ke through force-download karta hai correct filename ke saath
 *  4. Failure par friendly error message dikhata hai
 */
export type ApkDownloadResult =
  | { ok: true; via: 'direct'; filename: string }
  | { ok: false; reason: 'missing-config' | 'html-fallback' | 'not-found' | 'network'; message: string }

const PLACEHOLDER_PATH = '/roshan-digital-v2.0.0.apk'

/** Cheap HEAD probe: true only if the URL serves a real binary (not SPA-fallback HTML). */
function headOk(url: string): Promise<boolean> {
  return fetch(url, { method: 'HEAD' })
    .then((r) => r.ok && !(r.headers.get('content-type') || '').toLowerCase().includes('text/html'))
    .catch(() => false)
}

export async function downloadApkFile(
  url: string,
  showToast?: (msg: string) => void,
  filenameHint?: string,
): Promise<ApkDownloadResult> {
  const fallbackName = filenameHint || 'roshan-digital-app.apk'

  if (!url || url === PLACEHOLDER_PATH) {
    const msg = 'APK abhi tak upload nahi hui. Admin panel → APK Management se APK upload karein.'
    showToast?.(`⚠️ ${msg}`)
    return { ok: false, reason: 'missing-config', message: msg }
  }

  try {
    // Verify Firebase Storage or another permanent URL before downloading.
    const primaryUrl = new URL(url, window.location.origin).href
    const isFirebaseStorageUrl = primaryUrl.includes('firebasestorage.googleapis.com') || primaryUrl.includes('storage.googleapis.com')
    if (isFirebaseStorageUrl) {
      const anchor = document.createElement('a')
      anchor.href = primaryUrl
      anchor.download = fallbackName
      anchor.target = '_blank'
      anchor.rel = 'noopener'
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      showToast?.('✅ APK download shuru ho gayi!')
      return { ok: true, via: 'direct', filename: fallbackName }
    }
    if (!(await headOk(primaryUrl))) {
      const msg = 'APK file server par available nahi hai. Thori dair baad dobara koshish karein.'
      showToast?.(`⚠️ ${msg}`)
      return { ok: false, reason: 'not-found', message: msg }
    }

    const res = await fetch(primaryUrl)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const contentType = (res.headers.get('content-type') || '').toLowerCase()
    const blob = await res.blob()

    // SPA fallback detect karo: agar server HTML bhej raha hai to ye APK nahi hai
    if (contentType.includes('text/html') || blob.type.includes('text/html')) {
      const msg = 'APK file server par available nahi hai (HTML mila). Admin panel se APK dobara upload karein.'
      showToast?.(`⚠️ ${msg}`)
      return { ok: false, reason: 'html-fallback', message: msg }
    }

    // URL se filename nikaalo, warna fallback
    let filename = fallbackName
    try {
      const base = new URL(primaryUrl).pathname.split('/').pop() || ''
      if (base.toLowerCase().endsWith('.apk')) filename = decodeURIComponent(base)
    } catch {
      // keep fallback
    }

    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000)
    showToast?.('✅ APK download shuru ho gayi!')
    return { ok: true, via: 'direct', filename }
  } catch {
    const msg = 'APK download nahi ho saki. Internet connection check karein ya dobara koshish karein.'
    showToast?.(`❌ ${msg}`)
    return { ok: false, reason: 'network', message: msg }
  }
}
