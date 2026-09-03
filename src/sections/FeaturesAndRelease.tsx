import AdBanner from '../AdBanner'
import type { ApkVersion, FeatureItem, SiteSettings } from '../types'
import { downloadApkFile } from '../apkDownload'

const AD_SLOT_FEATURES = '1647148762'

export function FeaturesSection({
  features,
  onOpenAbout,
}: {
  features: FeatureItem[]
  onOpenAbout: () => void
}) {
  return (
    <>
      <section className="section features-section" id="about">
        <div className="section-heading">
          <p className="eyebrow">THE ROSHAN DIFFERENCE <span></span></p>
          <h2>Small details.<br /><em>A better experience.</em></h2>
          <p>Thoughtfully designed to keep your everyday financial life and digital assets moving in the right direction.</p>
        </div>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <article className="feature-card" key={feature.id || feature.title}>
              <div className="feature-img-wrap">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="feature-card-img"
                  loading="lazy"
                />
                <div className="feature-img-overlay"></div>
                <span className="feature-number">0{index + 1}</span>
                <div className="feature-icon">{feature.icon}</div>
              </div>
              <div className="feature-body">
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
                <a href="#about" onClick={(e) => { e.preventDefault(); onOpenAbout() }}>
                  Learn more <span>→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Ad Banner 1 — Between Features & App Section ── */}
      <AdBanner adSlot={AD_SLOT_FEATURES} adFormat="auto" style={{ margin: '0 auto', maxWidth: '970px', padding: '10px 20px' }} />
    </>
  )
}

export function AppReleaseSection({
  liveApk,
  siteSettings,
}: {
  liveApk: ApkVersion
  siteSettings: SiteSettings
}) {
  const logoUrl = siteSettings.images?.app_logo?.url || '/roshan-digital-logo-transparent.png'

  return (
    <section className="app-section" id="app">
      <div className="app-visual">
        <div className="orbit orbit-one"></div>
        <div className="orbit orbit-two"></div>
        <div className="app-badge">
          <img src={logoUrl} alt="Roshan Digital" className="app-badge-logo" />
        </div>
        <div className="version-stamp">LATEST<br /><b>RELEASE</b></div>
      </div>
      <div className="app-copy">
        <p className="eyebrow">THE LATEST RELEASE <span></span></p>
        <h2>Meet the new<br /><em>Roshan Digital.</em></h2>
        <p>More clarity. More control. A digital experience that is built around your financial growth.</p>
        <div className="release-details">
          <div><span>VERSION</span><b>{liveApk.version}</b></div>
          <div><span>RELEASED</span><b>{liveApk.releaseDate}</b></div>
          <div><span>FILE SIZE</span><b>{liveApk.size}</b></div>
        </div>
        <div className="whats-new">
          <b>WHAT'S NEW IN {liveApk.version}</b>
          <ul>
            {liveApk.changelog.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
        {/* APK version section se connected: LIVE APK ka real Supabase Storage URL */}
        <a
          className="button button-light"
          href={liveApk.downloadUrl}
          download
          onClick={(e) => {
            e.preventDefault()
            void downloadApkFile(liveApk.downloadUrl)
          }}
        >
          Download latest APK <span>↓</span>
        </a>
        <small className="android-note">For Android {liveApk.minAndroid} · APK file</small>

        {/* ── Official Google Play Store Badge ── */}
        <div className="store-badges" style={{ marginTop: '24px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <a
            href="https://play.google.com/store/apps/details?id=com.roshandigital.app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get it on Google Play"
            title="Get it on Google Play"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#000', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 18px', textDecoration: 'none', minWidth: '180px' }}
          >
            <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M0.431 0.366C0.163 0.648 0 1.084 0 1.65V22.35C0 22.916 0.163 23.352 0.431 23.634L0.503 23.704L12.09 12.117V11.883L0.503 0.296L0.431 0.366Z" fill="url(#pg0)"/>
              <path d="M16.013 15.941L12.09 12.117V11.883L16.013 8.059L16.104 8.11L20.747 10.746C22.084 11.504 22.084 12.742 20.747 13.5L16.104 16.136L16.013 15.941Z" fill="url(#pg1)"/>
              <path d="M16.104 16.136L12.09 12.117L0.431 23.634C0.872 24.098 1.598 24.155 2.41 23.697L16.104 16.136Z" fill="url(#pg2)"/>
              <path d="M16.104 8.11L2.41 0.549C1.598 0.091 0.872 0.148 0.431 0.612L12.09 12.117L16.104 8.11Z" fill="url(#pg3)"/>
              <defs>
                <linearGradient id="pg0" x1="11.133" y1="1.468" x2="-4.647" y2="17.248" gradientUnits="userSpaceOnUse"><stop stopColor="#00A0FF"/><stop offset="1" stopColor="#00E3FF"/></linearGradient>
                <linearGradient id="pg1" x1="22.814" y1="12" x2="-0.176" y2="12" gradientUnits="userSpaceOnUse"><stop stopColor="#FFE000"/><stop offset="1" stopColor="#FF9C00"/></linearGradient>
                <linearGradient id="pg2" x1="14.081" y1="14.297" x2="-7.118" y2="35.497" gradientUnits="userSpaceOnUse"><stop stopColor="#FF3A44"/><stop offset="1" stopColor="#C31162"/></linearGradient>
                <linearGradient id="pg3" x1="-1.952" y1="-7.44" x2="7.849" y2="2.362" gradientUnits="userSpaceOnUse"><stop stopColor="#32A071"/><stop offset="1" stopColor="#00F076"/></linearGradient>
              </defs>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.5px', lineHeight: 1 }}>GET IT ON</span>
              <span style={{ fontSize: '18px', color: '#fff', fontWeight: 600, letterSpacing: '-0.3px', lineHeight: 1.2 }}>Google Play</span>
            </div>
          </a>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '12px', color: 'var(--emerald)', fontWeight: 700, letterSpacing: '0.5px' }}>▲ COMING SOON</span>
            <span style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>Play Store listing in review.<br />Download APK directly above.</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export function AppScreenshotsSection() {
  return (
    <section className="section" style={{ background: 'rgba(15,23,42,0.6)', padding: '60px 24px' }}>
      <div className="section-heading" style={{ textAlign: 'center', marginBottom: '36px' }}>
        <p className="eyebrow">APP EXPERIENCE <span></span></p>
        <h2>Designed for<br /><em>clarity & control.</em></h2>
        <p>A glimpse into the powerful, intuitive world of Roshan Digital.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', maxWidth: '960px', margin: '0 auto' }}>
        {[
          { src: '/features/fast-reliable.jpg', label: 'Fast & Reliable Dashboard' },
          { src: '/features/secure-by-design.jpg', label: 'Secure by Design' },
          { src: '/features/easy-to-use.jpg', label: 'Easy to Use' },
          { src: '/features/always-improving.jpg', label: 'Always Improving' },
        ].map((shot) => (
          <figure key={shot.label} style={{ margin: 0, borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
            <img
              src={shot.src}
              alt={shot.label}
              loading="lazy"
              style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
            />
            <figcaption style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--muted)', background: 'rgba(15,23,42,0.9)', letterSpacing: '0.5px' }}>
              {shot.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
