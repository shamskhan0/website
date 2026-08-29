import type { SiteSettings, ApkVersion } from '../types'

export function SiteHeader({
  menuOpen,
  setMenuOpen,
  onOpenAbout,
}: {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
  onOpenAbout: () => void
}) {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Roshan Digital home">
        <img src="/roshan-digital-logo-transparent.png" alt="Roshan Digital" className="brand-logo-img" />
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
  return (
    <section className="hero-section">
      <div className="hero-copy reveal">
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
        <div className="sun-disc"></div>

        {/* ── Real App Phone Mockup ── */}
        <div className="phone phone-real">
          {/* Phone notch / camera */}
          <div className="phone-notch">
            <div className="phone-notch-camera"></div>
          </div>
          {/* Side buttons */}
          <div className="phone-btn phone-btn-vol-up"></div>
          <div className="phone-btn phone-btn-vol-down"></div>
          <div className="phone-btn phone-btn-power"></div>
          {/* Real app screenshot fills the screen */}
          <div className="phone-screen phone-screen-real">
            <img
              src="/app-screenshot.jpg"
              alt="Roshan Digital App — Home Screen"
              className="phone-screenshot-img"
              draggable={false}
            />
          </div>
          {/* Home indicator bar */}
          <div className="phone-home-bar"></div>
        </div>

        {/* Floating stat badges around the phone */}
        <div className="phone-badge phone-badge-left">
          <span className="phone-badge-icon">📈</span>
          <div>
            <b>+18.4%</b>
            <small>Monthly Return</small>
          </div>
        </div>
        <div className="phone-badge phone-badge-right">
          <span className="phone-badge-icon">🔒</span>
          <div>
            <b>256-bit</b>
            <small>AES Encrypted</small>
          </div>
        </div>
        <div className="phone-badge phone-badge-bottom">
          <span style={{ color: 'var(--emerald)', fontWeight: 800 }}>✦</span>
          <small>AI Insights Active</small>
        </div>
      </div>
    </section>
  )
}
