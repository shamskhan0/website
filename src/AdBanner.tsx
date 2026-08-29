import { useEffect, useRef } from 'react'

// Extend Window to include adsbygoogle
declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

interface AdBannerProps {
  adSlot: string          // Your Ad Slot ID from AdSense dashboard (e.g. "1234567890")
  adFormat?: string       // "auto" | "rectangle" | "vertical" | "horizontal"
  style?: React.CSSProperties
  className?: string
}

/**
 * AdBanner — Drop-in Google AdSense ad unit.
 *
 * Usage:
 *   <AdBanner adSlot="1234567890" adFormat="auto" />
 *
 * Get your adSlot from: https://adsense.google.com → Ads → By ad unit → Display ads
 */
export default function AdBanner({
  adSlot,
  adFormat = 'auto',
  style,
  className,
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error('AdSense error:', e)
    }
  }, [])

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        overflow: 'hidden',
        ...style,
      }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-2612066213833436"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  )
}

