import { useMemo, useState } from 'react'

export interface OptimizedImageProps {
  src: string
  alt?: string
  className?: string
  style?: React.CSSProperties
  /** Intrinsic size hints prevent layout shift (CLS). */
  width?: number
  height?: number
  /** 'eager' + fetchPriority for above-the-fold images (hero, logo). */
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
  /** Cache-buster value (e.g. ManagedImage.version) applied as ?v= query. */
  version?: number | string
  /** Bounded retry count for transient network failures. Default 2. */
  retries?: number
  /** Shown if the image fails to load after retries. */
  fallbackSrc?: string
  /** Wrapper style (outer span reserves layout space). */
  wrapperStyle?: React.CSSProperties
  draggable?: boolean
}

/**
 * Normalizes an image URL:
 *  - rejects legacy broken values (blob:, localhost) so no broken image icon renders
 *  - appends ?v=<version> for cache-busting when an admin replaces an image
 */
export function normalizeImageUrl(
  src: string | undefined | null,
  version?: number | string,
): string {
  if (!src) return ''
  let url = src.trim()
  if (!url) return ''
  if (url.startsWith('blob:')) return '' // browser-session-only URL — never permanent
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:|\/)/.test(url)) return '' // never valid in production
  if (version !== undefined && url.startsWith('http')) {
    const sep = url.includes('?') ? '&' : '?'
    url = `${url.split('#')[0]}${sep}v=${version}`
  }
  return url
}

/**
 * Reusable image component with:
 *  - skeleton loading placeholder (no layout jump — wrapper reserves space via CSS)
 *  - bounded automatic retry on transient failures
 *  - graceful fallback on permanent failure
 *  - lazy/eager + fetchPriority control
 */
export function OptimizedImage({
  src,
  alt = '',
  className,
  style,
  width,
  height,
  loading = 'lazy',
  fetchPriority,
  version,
  retries = 2,
  fallbackSrc,
  wrapperStyle,
  draggable,
}: OptimizedImageProps) {
  const url = useMemo(() => normalizeImageUrl(src, version), [src, version])
  const [prevUrl, setPrevUrl] = useState(url)
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>(() => (url ? 'loading' : fallbackSrc ? 'ok' : 'error'))
  const [currentSrc, setCurrentSrc] = useState(() => url || fallbackSrc || '')
  const [retriesCount, setRetriesCount] = useState(0)

  // Sync state if url changes during render
  if (url !== prevUrl) {
    setPrevUrl(url)
    setRetriesCount(0)
    if (url) {
      setStatus('loading')
      setCurrentSrc(url)
    } else if (fallbackSrc) {
      setStatus('ok')
      setCurrentSrc(fallbackSrc)
    } else {
      setStatus('error')
      setCurrentSrc('')
    }
  }

  if (!url && !fallbackSrc) return null

  const handleError = () => {
    if (retriesCount < retries && url) {
      setRetriesCount((prev) => prev + 1)
      const attemptSrc = `${url}${url.includes('?') ? '&' : '?'}retry=${Date.now()}`
      setStatus('loading')
      window.setTimeout(() => setCurrentSrc(attemptSrc), 1000)
    } else if (fallbackSrc) {
      setStatus('ok')
      setCurrentSrc(fallbackSrc)
    } else {
      setStatus('error')
    }
  }

  return (
    <span
      style={{
        position: 'relative',
        display: 'block',
        overflow: 'hidden',
        ...wrapperStyle,
      }}
    >
      {status === 'loading' && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(100deg, rgba(148,163,184,0.08) 30%, rgba(148,163,184,0.2) 50%, rgba(148,163,184,0.08) 70%)',
            backgroundSize: '200% 100%',
            animation: 'imgShimmer 1.4s ease infinite',
          }}
        />
      )}
      {currentSrc ? (
        <img
          src={currentSrc}
          alt={status === 'error' ? 'Image unavailable' : alt}
          className={className}
          style={{
            ...style,
            opacity: status === 'ok' ? (style?.opacity ?? 1) : 0,
            transition: 'opacity 0.3s ease',
          }}
          width={width}
          height={height}
          loading={loading}
          decoding="async"
          {...(fetchPriority ? { fetchPriority } : {})}
          draggable={draggable}
          onLoad={() => setStatus('ok')}
          onError={handleError}
        />
      ) : (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            minHeight: '80px',
            color: '#64748b',
            fontSize: '12px',
          }}
        >
          Image unavailable
        </span>
      )}
    </span>
  )
}
