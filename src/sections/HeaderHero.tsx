import type { SiteSettings, ApkVersion, ManagedImage } from '../types'

const getManagedImageUrl = (image?: ManagedImage) => {
  if (!image?.url) return '/app-screenshot.jpg'

  const separator = image.url.includes('?') ? '&' : '?'
  return `${image.url}${separator}v=${image.version ?? 1}`
}

export function SiteHeader({
  menuOpen,
  setMenuOpen,
  onOpenAbout,
  siteSettings,
}: {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
  onOpenAbout: () => void
  siteSettings: SiteSettings
}) {
  const logoUrl = siteSettings.images?.app_logo?.url || '/roshan-digital-logo-transparent.png'

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Roshan Digital home">
        <img src={logoUrl} alt="Roshan Digital" className="brand-logo-img" />
      </a>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
        {menuOpen ? '×' : '☰'}
      </button>
      <nav className={menuOpen ? 'open' : ''}>
        <a href="#top" onClick={() => setMenuOpen(false)}>Home</a>
        <a href="#app" onClick={() => setMenuOpen(false)}>App</a>
        <a href="#news" onClick={() => setMenuOpen(false)}>News</a>
        <a href="#about" onClick={(e) => { e.preventDefault(); setMenuOpen(false); onOpenAbout() }}>About</a>
        <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
      </nav>
    </header>
  )
}

export function AnnouncementBar({ siteSettings }: { siteSettings: SiteSettings }) {
  if (!siteSettings.announcementActive) return null
  return (
    <div className="announcement">
      <span>●</span> {siteSettings.announcementText}{' '}
      <a href="#app">Download the latest APK <b>→</b></a>
    </div>
  )
}

export function HeroSection({
  siteSettings,
  liveApk,
}: {
  siteSettings: SiteSettings
  liveApk: ApkVersion
}) {
  const heroImage = getManagedImageUrl(siteSettings.images?.hero_mobile_image)

  return (
    <section className="hero-section">
      <div className="hero-copy reveal">
        <div className="hero-badge">THE NEXT GENERATION OF DIGITAL FINANCE</div>
        <p className="eyebrow">DIGITAL, MADE HUMAN <span></span></p>
        <h1>{siteSettings.heroTitle}</h1>
        <p className="hero-text">{siteSettings.heroSubtitle}</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#app">Download latest APK <span>↓</span></a>
          <a className="text-link" href="#news">Explore latest news <span>→</span></a>
        </div>
        <div className="hero-meta">
          <span><b className="live-dot"></b> Version {liveApk.version} is live</span>
          <span>Updated {liveApk.releaseDate}</span>
        </div>
      </div>
      <div className="hero-art reveal-delay">
        <div className="glass-orbit orbit-one" aria-hidden="true"></div>
        <div className="glass-orbit orbit-two" aria-hidden="true"></div>
        <div className="glass-orbit orbit-three" aria-hidden="true"></div>
        <div className="sun-disc"></div>
        <div className="floating-chip chip-left">
          <span className="chip-dot"></span>
          <b>+18.4%</b>
          <small>Monthly growth</small>
        </div>
        <div className="floating-chip chip-right">
          <span className="chip-line"></span>
          <b>AI Secure</b>
          <small>Protected access</small>
        </div>
        <div className="device-shell">
          <div className="phone-frame" aria-label="Roshan Digital dashboard screenshot">
            <div className="phone-notch" aria-hidden="true"></div>
            <img
              src={heroImage}
              alt="Roshan Digital dashboard screen"
              className="phone-screen-image"
              draggable={false}
            />
          </div>
          <div className="phone-stand" aria-hidden="true"></div>
        </div>
      </div>
    </section>
  )
}
