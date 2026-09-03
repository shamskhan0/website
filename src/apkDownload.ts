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
export async function downloadApkFile(
  url: string,
  showToast?: (msg: string) => void,
): Promise<void> {
  const fallbackName = 'roshan-digital-app.apk'

  if (!url || url === '/roshan-digital-v2.0.0.apk') {
    showToast?.('⚠️ APK abhi tak upload nahi hui. Admin panel → APK Management se APK upload karein.')
    return
  }

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const contentType = (res.headers.get('content-type') || '').toLowerCase()
    const blob = await res.blob()

    // SPA fallback detect karo: agar server HTML bhej raha hai to ye APK nahi hai
    if (contentType.includes('text/html') || blob.type.includes('text/html')) {
      showToast?.('⚠️ APK file server par available nahi hai (HTML mila). Admin panel se APK dobara upload karein.')
      return
    }

    // URL se filename nikaalo, warna fallback
    let filename = fallbackName
    try {
      const pathname = new URL(url, window.location.origin).pathname
      const base = pathname.split('/').pop() || ''
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
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000)
    showToast?.('✅ APK download shuru ho gayi!')
  } catch {
    showToast?.('❌ APK download nahi ho saki. Internet connection check karein ya dobara koshish karein.')
  }
}
