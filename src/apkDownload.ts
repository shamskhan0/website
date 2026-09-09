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
  | { ok: true; via: 'direct' | 'supabase-param' | 'bucket-fallback'; filename: string }
  | { ok: false; reason: 'missing-config' | 'html-fallback' | 'not-found' | 'network'; message: string }

const PLACEHOLDER_PATH = '/roshan-digital-v2.0.0.apk'

/** Candidate bucket paths probed when the primary URL fails. */
function bucketCandidates(supabaseUrl: string, filenameHint: string): string[] {
  const base = supabaseUrl.replace(/\/+$/, '')
  const stamp = filenameHint.replace(/[^\w.-]/g, '') || 'roshan-digital-app.apk'
  return [
    `${base}/storage/v1/object/public/media/apk/${encodeURIComponent(stamp)}`,
    `${base}/storage/v1/object/public/media/apk/latest.apk`,
  ]
}

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

  const isSupabase = url.startsWith('http') && (url.includes('supabase.co') || url.includes('/storage/'))
  const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? ''

  try {
    // ---- Supabase Storage path: verify via HEAD first, ?download= param forces
    // the correct filename (cross-origin 'download' attribute is ignored).
    // HEAD failure -> bucket-fallback probe -> structured failure (retry UI).
    if (isSupabase) {
      if (!(await headOk(url))) {
        let fallback: string | null = null
        if (supabaseUrl) {
          for (const c of bucketCandidates(supabaseUrl, fallbackName)) {
            if (await headOk(c)) {
              fallback = c
              break
            }
          }
        }
        if (!fallback) {
          const msg = 'APK file abhi available nahi hai. Thori dair baad dobara koshish karein.'
          showToast?.(`⚠️ ${msg}`)
          return { ok: false, reason: 'not-found', message: msg }
        }
        // Serve the fallback through the same blob path below
        const res2 = await fetch(fallback)
        if (!res2.ok) throw new Error(`HTTP ${res2.status}`)
        const blob2 = await res2.blob()
        const blobUrl2 = URL.createObjectURL(blob2)
        const a2 = document.createElement('a')
        a2.href = blobUrl2
        a2.download = fallbackName
        document.body.appendChild(a2)
        a2.click()
        a2.remove()
        setTimeout(() => URL.revokeObjectURL(blobUrl2), 10_000)
        showToast?.('✅ APK download shuru ho gayi! (fallback bucket)')
        return { ok: true, via: 'bucket-fallback', filename: fallbackName }
      }

      const sep = url.includes('?') ? '&' : '?'
      const a = document.createElement('a')
      a.href = `${url}${sep}download=${encodeURIComponent(fallbackName)}`
      a.download = fallbackName
      a.rel = 'noopener noreferrer'
      document.body.appendChild(a)
      a.click()
      a.remove()
      showToast?.('✅ APK download shuru ho gayi!')
      return { ok: true, via: 'supabase-param', filename: fallbackName }
    }

    // ---- Primary URL probe; bucket fallback jab primary fail/HTML ho ----
    const primaryUrl = new URL(url, window.location.origin).href
    let targetUrl = primaryUrl
    let via: 'direct' | 'bucket-fallback' = 'direct'

    if (!(await headOk(primaryUrl))) {
      if (supabaseUrl) {
        for (const c of bucketCandidates(supabaseUrl, fallbackName)) {
          if (await headOk(c)) {
            targetUrl = c
            via = 'bucket-fallback'
            break
          }
        }
      }
      if (targetUrl === primaryUrl) {
        const msg = 'APK file server par available nahi hai. Thori dair baad dobara koshish karein.'
        showToast?.(`⚠️ ${msg}`)
        return { ok: false, reason: 'not-found', message: msg }
      }
    }

    const res = await fetch(targetUrl)
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
      const base = new URL(targetUrl).pathname.split('/').pop() || ''
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
    return { ok: true, via, filename }
  } catch {
    const msg = 'APK download nahi ho saki. Internet connection check karein ya dobara koshish karein.'
    showToast?.(`❌ ${msg}`)
    return { ok: false, reason: 'network', message: msg }
  }
}
