import { useCallback, useState } from 'react'
import type { ApkVersion } from '../types'
import { downloadApkFile } from '../apkDownload'

/**
 * APK download button with status + retry UI.
 * - Real <a href> preserved for SEO/semantics; click is intercepted.
 * - On failure shows the reason and a one-tap "Retry" button (mobile-friendly).
 */
export function ApkDownloadButton({
  liveApk,
  className,
  label = 'Download latest APK',
}: {
  liveApk: ApkVersion
  className?: string
  label?: string
}) {
  const [status, setStatus] = useState<{ failed: boolean; message: string } | null>(null)
  const [busy, setBusy] = useState(false)

  const run = useCallback(() => {
    setBusy(true)
    setStatus(null)
    void downloadApkFile(
      liveApk.downloadUrl,
      undefined,
      `roshan-digital-v${liveApk.version}.apk`,
    ).then((result) => {
      setBusy(false)
      if (!result.ok) setStatus({ failed: true, message: result.message })
    })
  }, [liveApk])

  return (
    <div className="apk-download-wrap">
      <a
        className={className || 'button button-light'}
        href={liveApk.downloadUrl}
        download
        aria-busy={busy}
        onClick={(e) => {
          e.preventDefault()
          if (!busy) run()
        }}
      >
        {busy ? 'Preparing…' : label} <span aria-hidden="true">↓</span>
      </a>
      {status?.failed && (
        <div className="apk-download-retry" role="alert">
          <span>⚠️ {status.message}</span>
          <button type="button" className="apk-retry-btn" onClick={run} disabled={busy}>
            ↻ Retry download
          </button>
        </div>
      )}
    </div>
  )
}
