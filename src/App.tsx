import { useState } from 'react'
import './App.css'
import './brand.css'
import './hero-theme.css'
import './center-hero.css'
import './login-theme.css'
import AdBanner from './AdBanner'

// ── Google AdSense Ad Slot IDs ──────────────────────────────────────────────
// Replace each value below with the unique slot ID from your AdSense dashboard:
//   https://adsense.google.com → Ads → By ad unit → Display ads → Create new
const AD_SLOT_FEATURES     = '1647148762' // Ad unit 1 — Between Features & App sections
const AD_SLOT_NEWS         = '1647148763' // Ad unit 2 — Between News & Contact sections
const AD_SLOT_FOOTER       = '1647148764' // Ad unit 3 — Above Footer (horizontal banner)
// ────────────────────────────────────────────────────────────────────────────

export interface NewsItem {
  id: string
  date: string
  title: string
  text: string
  tag: string
  color: string
  imageUrl?: string
  featured?: boolean
  readTime?: string
  author?: string
  highlights?: string[]
  ctaText?: string
}

export interface ApkVersion {
  id: string
  version: string
  build: number
  releaseDate: string
  size: string
  status: 'LIVE' | 'ARCHIVED' | 'BETA'
  minAndroid: string
  downloads: number
  sha256: string
  changelog: string[]
  downloadUrl: string
}

export interface SiteSettings {
  announcementText: string
  announcementActive: boolean
  heroTitle: string
  heroSubtitle: string
  supportEmail: string
  telegramLink: string
  apkDownloadUrl: string
  maintenanceMode: boolean
}

const INITIAL_FEATURES = [
  {
    icon: '✦',
    title: 'Fast & reliable',
    text: 'A smooth experience built for everyday digital services and instant AI transactions.',
    image: '/features/fast-reliable.jpg',
  },
  {
    icon: '⌁',
    title: 'Secure by design',
    text: 'Thoughtful 256-bit cryptographic protection keeps your digital life in trusted hands.',
    image: '/features/secure-by-design.jpg',
  },
  {
    icon: '◌',
    title: 'Easy to use',
    text: 'Clear, friendly tools and real-time dashboards that help you get more done effortlessly.',
    image: '/features/easy-to-use.jpg',
  },
  {
    icon: '↗',
    title: 'Always improving',
    text: 'Regular continuous releases bring useful automated features and machine learning refinements.',
    image: '/features/always-improving.jpg',
  },
]

const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-kyc',
    date: '27 AUG 2026',
    title: 'Your Next Step: Complete Your KYC',
    text: 'Complete your KYC verification to unlock the next step of your Roshan Digital journey. Verify your identity securely and keep your account information accurate and up to date.',
    tag: 'KYC VERIFICATION',
    color: 'emerald',
    featured: true,
    readTime: '2 MIN VERIFY',
    author: 'Roshan Digital Security & Compliance',
    highlights: ['Government ID & Passport Sync', 'Instant Biometric Liveness Scan', 'Bank-Grade 256-bit Encryption'],
    imageUrl: '/news/kyc-verification.jpg',
    ctaText: 'Complete KYC →',
  },
  {
    id: 'news-featured',
    date: '27 AUG 2026',
    title: 'The Next Leap: How AI-Driven Wealth Intelligence is Transforming Daily Digital Profits',
    text: 'Our version 2.0 release combines military-grade encryption with predictive neural trading algorithms to safeguard assets while generating consistent daily returns.',
    tag: 'AI & FINANCIAL INTELLIGENCE',
    color: 'emerald',
    featured: false,
    readTime: '4 MIN READ',
    author: 'Roshan Digital Intelligence',
    highlights: ['+18.4% Monthly Alpha', '256-bit AES Cryptography', 'Zero-Knowledge Privacy'],
    imageUrl: '/news/featured-ai-wealth.jpg',
  },
  {
    id: 'news-1',
    date: '27 AUG 2026',
    title: 'Roshan Digital App v2.0 is here',
    text: 'A faster dashboard, improved security and a more intuitive mobile experience for all users.',
    tag: 'PRODUCT UPDATE',
    color: 'violet',
    imageUrl: '/news/app-release-v2.jpg',
  },
  {
    id: 'news-2',
    date: '18 AUG 2026',
    title: 'Your digital journey, simplified',
    text: 'Discover the smart analytics and tools designed to make your everyday services feel effortless.',
    tag: 'INSIGHTS',
    color: 'blue',
    imageUrl: '/news/digital-journey.jpg',
  },
  {
    id: 'news-3',
    date: '04 AUG 2026',
    title: 'Building trust through every tap',
    text: 'How Roshan Digital keeps security and people at the centre of every update we ship.',
    tag: 'OUR STORY',
    color: 'gold',
    imageUrl: '/news/cyber-trust.jpg',
  },
]

const INITIAL_APK_VERSIONS: ApkVersion[] = [
  {
    id: 'apk-1',
    version: '2.0.0',
    build: 200,
    releaseDate: '27 August 2026',
    size: '48.6 MB',
    status: 'LIVE',
    minAndroid: '8.0 and above',
    downloads: 12450,
    sha256: '9f83a8b27c6d1e405a38b4c59d72e6f1a8b9c0d2e4f6a8b0c2d4e6f8a0b2c4d6',
    changelog: [
      'Faster, more intuitive AI portfolio dashboard',
      'Improved military-grade security and performance',
      'A smoother mobile experience for instant releases',
    ],
    downloadUrl: '/roshan-digital-v2.0.0.apk',
  },
  {
    id: 'apk-2',
    version: '1.9.4',
    build: 194,
    releaseDate: '18 August 2026',
    size: '46.2 MB',
    status: 'ARCHIVED',
    minAndroid: '8.0 and above',
    downloads: 8920,
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    changelog: ['Fixed portfolio balance sync issue', 'Improved battery efficiency on Android 13+'],
    downloadUrl: '/roshan-digital-v2.0.0.apk',
  },
  {
    id: 'apk-3',
    version: '1.9.0',
    build: 190,
    releaseDate: '04 August 2026',
    size: '44.8 MB',
    status: 'ARCHIVED',
    minAndroid: '8.0 and above',
    downloads: 15300,
    sha256: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
    changelog: ['Initial AI investment prediction engine integration', 'Biometric login overhaul'],
    downloadUrl: '/roshan-digital-v2.0.0.apk',
  },
]

const INITIAL_SITE_SETTINGS: SiteSettings = {
  announcementText: 'Latest update: Roshan Digital App v2.0 is now available',
  announcementActive: true,
  heroTitle: 'Roshan Digital.',
  heroSubtitle:
    'Your trusted AI-powered platform for secure investments, daily profits and convenient digital services wherever life takes you.',
  supportEmail: 'support@roshandigital.com',
  telegramLink: 'https://t.me/roshandigital',
  apkDownloadUrl: '/roshan-digital-v2.0.0.apk',
  maintenanceMode: false,
}

interface AdminUser {
  name: string
  email: string
  role: string
  avatar: string
}

const ADMIN_CREDENTIALS = [
  {
    email: 'shamskhan1335@gmail.com',
    password: 'admin@123',
    name: 'Shams Khan',
    role: 'Super administrator',
    avatar: 'SK',
  },
  {
    email: 'admin@roshandigital.com',
    password: 'admin@123',
    name: 'Shams Khan',
    role: 'Super administrator',
    avatar: 'SK',
  },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [activeModal, setActiveModal] = useState<'help' | 'privacy' | 'about' | 'terms' | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null)

  // Dynamic Data States saved in localStorage
  const [newsList, setNewsList] = useState<NewsItem[]>(() => {
    try {
      const saved = localStorage.getItem('rd_news_data_v3')
      return saved ? JSON.parse(saved) : INITIAL_NEWS
    } catch {
      return INITIAL_NEWS
    }
  })

  const [apkVersions, setApkVersions] = useState<ApkVersion[]>(() => {
    try {
      const saved = localStorage.getItem('rd_apk_versions')
      return saved ? JSON.parse(saved) : INITIAL_APK_VERSIONS
    } catch {
      return INITIAL_APK_VERSIONS
    }
  })

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('rd_site_settings')
      return saved ? JSON.parse(saved) : INITIAL_SITE_SETTINGS
    } catch {
      return INITIAL_SITE_SETTINGS
    }
  })

  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('rd_admin_session')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [adminLoggedIn, setAdminLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem('rd_admin_session'))
  })
  const [activeAdmin, setActiveAdmin] = useState('Dashboard')

  // Live active APK
  const liveApk = apkVersions.find((v) => v.status === 'LIVE') || apkVersions[0]

  // Featured Article + Grid Articles
  const featuredArticle = newsList.find((n) => n.featured) || newsList[0]
  const gridArticles = newsList.filter((n) => n.id !== featuredArticle?.id)

  const handleLogin = (user: AdminUser) => {
    setCurrentUser(user)
    setAdminLoggedIn(true)
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem('rd_admin_session')
    } catch {
      // ignore
    }
    setCurrentUser(null)
    setAdminLoggedIn(false)
    setAdminOpen(false)
  }

  // Update helper functions
  const updateNewsList = (newItems: NewsItem[]) => {
    setNewsList(newItems)
    try {
      localStorage.setItem('rd_news_data_v3', JSON.stringify(newItems))
    } catch {
      // ignore
    }
  }

  const updateApkVersions = (newVersions: ApkVersion[]) => {
    setApkVersions(newVersions)
    try {
      localStorage.setItem('rd_apk_versions', JSON.stringify(newVersions))
    } catch {
      // ignore
    }
  }

  const updateSiteSettings = (newSettings: SiteSettings) => {
    setSiteSettings(newSettings)
    try {
      localStorage.setItem('rd_site_settings', JSON.stringify(newSettings))
    } catch {
      // ignore
    }
  }

  if (adminOpen) {
    if (!adminLoggedIn) {
      return <AdminLogin onLogin={handleLogin} onExit={() => setAdminOpen(false)} />
    }
    return (
      <AdminDashboard
        user={currentUser}
        onExit={handleLogout}
        active={activeAdmin}
        setActive={setActiveAdmin}
        newsList={newsList}
        setNewsList={updateNewsList}
        apkVersions={apkVersions}
        setApkVersions={updateApkVersions}
        siteSettings={siteSettings}
        setSiteSettings={updateSiteSettings}
      />
    )
  }

  return (
    <div className="site-shell">
      {siteSettings.announcementActive && (
        <div className="announcement">
          <span>●</span> {siteSettings.announcementText}{' '}
          <a href="#app">Download the latest APK <b>→</b></a>
        </div>
      )}

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
          <a href="#about" onClick={(e) => { e.preventDefault(); setMenuOpen(false); setActiveModal('about') }}>About</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
      </header>

      <main id="top">
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

        <section className="trust-strip">
          <span>Built for the way you live digitally</span>
          <div><b>01</b><i></i><b>02</b><i></i><b>03</b><i></i><b>04</b></div>
        </section>

        <section className="section features-section" id="about">
          <div className="section-heading">
            <p className="eyebrow">THE ROSHAN DIFFERENCE <span></span></p>
            <h2>Small details.<br /><em>A better experience.</em></h2>
            <p>Thoughtfully designed to keep your everyday financial life and digital assets moving in the right direction.</p>
          </div>
          <div className="feature-grid">
            {INITIAL_FEATURES.map((feature, index) => (
              <article className="feature-card" key={feature.title}>
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
                  <a href="#about" onClick={(e) => { e.preventDefault(); setActiveModal('about') }}>
                    Learn more <span>→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Ad Banner 1 — Between Features & App Section ── */}
        <AdBanner adSlot={AD_SLOT_FEATURES} adFormat="auto" style={{ margin: '0 auto', maxWidth: '970px', padding: '10px 20px' }} />

        <section className="app-section" id="app">
          <div className="app-visual">
            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>
            <div className="app-badge">
              <img src="/roshan-digital-logo-transparent.png" alt="Roshan Digital" className="app-badge-logo" />
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
            <a className="button button-light" href={siteSettings.apkDownloadUrl || liveApk.downloadUrl} download>
              Download latest APK <span>↓</span>
            </a>
            <small className="android-note">For Android {liveApk.minAndroid} · APK file</small>

            {/* ── Google Play Store Badge ── */}
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

        {/* ── App Screenshots Section ── */}
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

        {/* ── Data Safety Section (Required by Google Play Store) ── */}
        <section className="section" id="data-safety" style={{ padding: '72px 24px', background: 'linear-gradient(180deg, rgba(16,185,129,0.04) 0%, rgba(15,23,42,0) 100%)' }}>
          <div className="section-heading" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="eyebrow">GOOGLE PLAY DATA SAFETY <span></span></p>
            <h2>Your data,<br /><em>your control.</em></h2>
            <p>Transparent summary of how Roshan Digital collects, uses and protects your information — as required by Google Play's Data Safety policy.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', maxWidth: '1040px', margin: '0 auto 40px' }}>
            <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}><span style={{ fontSize: '24px' }}>📦</span><h3 style={{ margin: 0, fontSize: '16px', color: '#fff' }}>Data Collected</h3></div>
              {[['Account info', 'Name, email, phone'],['Financial data', 'Investment records (encrypted)'],['Device identifiers', 'Model, OS version'],['Crash telemetry', 'Anonymous diagnostics'],['Biometric (KYC only)', 'Not retained after verification']].map(([label, detail]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#cbd5e1' }}>{label}</span>
                  <span style={{ fontSize: '12px', color: 'var(--muted)', textAlign: 'right' }}>{detail}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}><span style={{ fontSize: '24px' }}>🔒</span><h3 style={{ margin: 0, fontSize: '16px', color: '#fff' }}>Data Sharing</h3></div>
              {[['Sold to third parties', false],['Shared with advertisers', false],['Google AdSense (website ads)', true],['Regulatory authorities (if required)', true]] .map(([label, value]) => (
                <div key={String(label)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#cbd5e1' }}>{label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: value ? 'var(--emerald)' : '#ef4444' }}>{value ? '✓ Yes' : '✗ No'}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}><span style={{ fontSize: '24px' }}>🛡️</span><h3 style={{ margin: 0, fontSize: '16px', color: '#fff' }}>Security & Rights</h3></div>
              {[['Encrypted in transit', true],['Encrypted at rest', true],['Request data deletion', true],['Children under 13 targeted', false]].map(([label, value]) => (
                <div key={String(label)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#cbd5e1' }}>{label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: value ? 'var(--emerald)' : '#ef4444' }}>{value ? '✓ Yes' : '✗ No'}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'center', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '16px', padding: '28px 24px', maxWidth: '560px', margin: '0 auto' }}>
            <h3 style={{ margin: '0 0 10px', color: '#fff', fontSize: '17px' }}>Request Data Deletion</h3>
            <p style={{ margin: '0 0 18px', fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>Under Google Play's policy, you can request deletion of your account and all associated personal data at any time.</p>
            <a href="mailto:privacy@roshandigital.com?subject=Data%20Deletion%20Request&body=Please%20delete%20my%20account%20and%20all%20associated%20data." className="button button-primary" style={{ display: 'inline-block' }}>Request Account Deletion ↗</a>
          </div>
        </section>

        <section className="section news-section" id="news">
          <div className="section-heading news-heading">
            <p className="eyebrow">FROM ROSHAN DIGITAL <span></span></p>
            <h2>Good things,<br /><em>worth knowing.</em></h2>
            <a className="text-link" href="#news">View all stories <span>→</span></a>
          </div>

          {/* Featured Article Card */}
          {featuredArticle && (
            <article className="featured-article-card">
              <div className="featured-visual">
                {featuredArticle.imageUrl && (
                  <img
                    src={featuredArticle.imageUrl}
                    alt={featuredArticle.title}
                    className="featured-img"
                    loading="lazy"
                  />
                )}
                <div className="featured-overlay"></div>
                <div className="featured-badge-bar">
                  <span className="featured-badge">★ FEATURED STORY</span>
                  <span className="featured-read-time">{featuredArticle.readTime || '4 MIN READ'}</span>
                </div>
              </div>
              <div className="featured-content">
                <div className="featured-meta">
                  <time>{featuredArticle.date}</time>
                  <span>•</span>
                  <span>By {featuredArticle.author || 'Roshan Digital Intelligence'}</span>
                </div>
                <h3 className="featured-title">{featuredArticle.title}</h3>
                <p className="featured-text">{featuredArticle.text}</p>
                <div className="featured-stats">
                  {(featuredArticle.highlights || ['+18.4% Monthly Alpha', '256-bit AES Cryptography', 'Zero-Knowledge Privacy']).map((stat, i) => (
                    <span key={i} className="featured-stat-pill">✦ {stat}</span>
                  ))}
                </div>
                <div className="featured-actions">
                  <button
                    className="button button-primary"
                    onClick={() => setSelectedArticle(featuredArticle)}
                  >
                    {featuredArticle.ctaText || 'Read Full Article ↗'}
                  </button>
                </div>
              </div>
            </article>
          )}

          {/* Regular News Grid */}
          <div className="news-grid">
            {gridArticles.map((item) => (
              <article className="news-card" key={item.id}>
                <div className={`news-image ${item.color}`}>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.title} className="news-img-cover" loading="lazy" />
                  )}
                  <div className="news-image-overlay"></div>
                  <span>{item.tag}</span>
                </div>
                <div className="news-content">
                  <time>{item.date}</time>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <a
                    href="#news"
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectedArticle(item)
                    }}
                  >
                    Read story <span>→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Ad Banner 2 — Between News & Contact Section ── */}
        <AdBanner adSlot={AD_SLOT_NEWS} adFormat="auto" style={{ margin: '0 auto', maxWidth: '970px', padding: '10px 20px' }} />

        <section className="contact-section" id="contact">
          <div>
            <p className="eyebrow">WE'RE HERE TO HELP <span></span></p>
            <h2>Have a question?<br /><em>Let's talk.</em></h2>
          </div>
          <a className="button button-primary" href={`mailto:${siteSettings.supportEmail}`}>
            Get in touch <span>↗</span>
          </a>
        </section>
      </main>

      {/* ── Ad Banner 3 — Above Footer ── */}
      <AdBanner adSlot={AD_SLOT_FOOTER} adFormat="horizontal" style={{ margin: '0 auto', maxWidth: '970px', padding: '10px 20px' }} />

      <footer>
        <div className="footer-main">
          <div>
            <a className="brand" href="#top" aria-label="Roshan Digital">
              <img src="/roshan-digital-logo-transparent.png" alt="Roshan Digital" className="footer-logo-img" />
            </a>
            <p>Secure Investments. Daily Profits.<br />Smarter Decisions with AI.</p>
          </div>
          <div className="footer-links">
            <div>
              <b>Explore</b>
              <a href="#app">The app</a>
              <a href="#news">News & stories</a>
              <a href="#about" onClick={(e) => { e.preventDefault(); setActiveModal('about') }}>About us</a>
            </div>
            <div>
              <b>Support</b>
              <a href="#help" onClick={(e) => { e.preventDefault(); setActiveModal('help') }}>Help centre</a>
              <a href="#contact">Contact us</a>
              <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy policy ↗</a>
              <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of service ↗</a>
              <a href="/#data-safety">Data safety</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Roshan Digital. All rights reserved.</span>
          <button onClick={() => setAdminOpen(true)}>Thanks you ↗</button>
          <span>Made for better days.</span>
        </div>
      </footer>

      {/* Interactive Modals */}
      {activeModal === 'privacy' && <PrivacyPolicyModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'help' && <HelpCenterModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'about' && <AboutModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'terms' && <TermsOfServiceModal onClose={() => setActiveModal(null)} />}
      {selectedArticle && <ArticleReaderModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />}
    </div>
  )
}

function ArticleReaderModal({
  article,
  onClose,
}: {
  article: NewsItem
  onClose: () => void
}) {
  const isKyc = article.tag === 'KYC VERIFICATION'

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="modal-title-lockup">
            <img src="/roshan-digital-logo-transparent.png" alt="Roshan Digital" />
            <div>
              <span style={{ fontSize: '10px', color: 'var(--emerald)', fontWeight: 800, letterSpacing: '1px' }}>
                {article.tag}
              </span>
              <p style={{ margin: 0 }}>{article.date} · {article.author || 'Roshan Digital Security & Compliance'}</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close article">×</button>
        </header>
        <div className="modal-body" style={{ maxHeight: '70vh' }}>
          {article.imageUrl && (
            <div style={{ borderRadius: '12px', overflow: 'hidden', height: '260px', marginBottom: '20px', position: 'relative' }}>
              <img src={article.imageUrl} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <h2 style={{ fontSize: '24px', color: '#fff', margin: '0 0 16px 0', lineHeight: 1.3 }}>
            {article.title}
          </h2>
          <p style={{ fontSize: '15px', color: '#cbd5e1', lineHeight: 1.7, marginBottom: '20px' }}>
            {article.text}
          </p>

          {isKyc ? (
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
              <h4 style={{ color: 'var(--emerald)', margin: '0 0 12px 0', fontSize: '15px' }}>
                ✦ 3 Simple Steps to Complete Verification:
              </h4>
              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'rgba(15, 23, 42, 0.6)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ background: 'var(--emerald)', color: '#000', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', flexShrink: 0 }}>1</span>
                  <div>
                    <b style={{ color: '#fff', fontSize: '13px' }}>Government Identity Document</b>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>Upload a clear photo of your valid CNIC, National ID, or International Passport.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'rgba(15, 23, 42, 0.6)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ background: 'var(--emerald)', color: '#000', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', flexShrink: 0 }}>2</span>
                  <div>
                    <b style={{ color: '#fff', fontSize: '13px' }}>Biometric Liveness Scan</b>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>Complete a fast 5-second 3D selfie scan to match your face with your ID.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'rgba(15, 23, 42, 0.6)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ background: 'var(--emerald)', color: '#000', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', flexShrink: 0 }}>3</span>
                  <div>
                    <b style={{ color: '#fff', fontSize: '13px' }}>Instant Automated Activation</b>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>Our secure bank-grade AI verifies your account credentials in under 2 minutes.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '12px', padding: '18px 20px', marginBottom: '20px' }}>
              <h4 style={{ color: 'var(--emerald)', margin: '0 0 8px 0', fontSize: '14px' }}>Key Architecture Takeaways:</h4>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#94a3b8', fontSize: '13px' }}>
                <li>Real-time telemetry and predictive daily profit adjustments via automated AI indicator weighting.</li>
                <li>Bank-grade security isolation backed by 256-bit AES encryption standards.</li>
                <li>Seamless synchronized mobile app integration for instant updates and push telemetry.</li>
              </ul>
            </div>
          )}
        </div>
        <footer className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="text-link" onClick={onClose}>Back to Stories</button>
          <a
            className="button button-primary"
            href="#app"
            onClick={onClose}
          >
            {isKyc ? 'Start KYC in App →' : 'Explore Platform →'}
          </a>
        </footer>
      </div>
    </div>
  )
}

function PrivacyPolicyModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="modal-title-lockup">
            <img src="/roshan-digital-logo-transparent.png" alt="Roshan Digital" />
            <div>
              <h2>Privacy Policy</h2>
              <p>Roshan Digital Data Protection & Privacy</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        </header>
        <div className="modal-body">
          <p><strong>Effective Date:</strong> August 27, 2026</p>
          <p>At Roshan Digital, your security and privacy are our top priorities. This Privacy Policy explains how we collect, use, protect, and handle your information across all Roshan Digital services and applications.</p>
          
          <h3>1. Information We Collect</h3>
          <p>We collect essential operational information necessary to provide AI-powered portfolio insights and secure digital account services:</p>
          <ul>
            <li><strong>Account Information:</strong> Name, verified email address, phone number, and security credentials.</li>
            <li><strong>Financial Analytics:</strong> Secure investment transaction records and analytics logs encrypted end-to-end.</li>
            <li><strong>Device & Usage Data:</strong> IP address, device model, operating system version, and anonymous crash telemetry.</li>
            <li><strong>Biometric Data (KYC):</strong> Facial scan data used solely for identity verification — not stored beyond verification completion.</li>
            <li><strong>Location Data:</strong> General region data for regulatory compliance only. Precise GPS is never collected.</li>
          </ul>

          <h3>2. How We Use Your Data</h3>
          <ul>
            <li>Provide, maintain, and improve our AI investment services</li>
            <li>Verify your identity and prevent fraudulent activity</li>
            <li>Send important service notifications and security alerts</li>
            <li>Comply with applicable financial regulations and legal obligations</li>
            <li>Analyse anonymous usage patterns to improve app performance</li>
          </ul>

          <h3>3. How We Protect Your Data</h3>
          <p>All sensitive communications and database storage utilize AES-256 and TLS 1.3 cryptographic encryption. We strictly implement zero-knowledge architecture for user credentials and automated AI models.</p>

          <h3>4. Third-Party Services & SDKs</h3>
          <p>Our application and website integrate the following third-party services, each with their own privacy practices:</p>
          <ul>
            <li><strong>Google AdSense:</strong> Displays advertising on our website. Google may use cookies to serve relevant ads. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--emerald)' }}>Google's Privacy Policy</a>.</li>
            <li><strong>Google Analytics (if enabled):</strong> Anonymous traffic analysis. Data is anonymised before processing.</li>
          </ul>
          <p>We do not sell, rent, or trade your personal or financial data to any third parties or advertising brokers beyond the disclosures above.</p>

          <h3>5. Data Retention</h3>
          <p>We retain your personal data only as long as necessary to provide our services or as required by law. Account data is deleted within 30 days of account closure upon request.</p>

          <h3>6. Your Rights — Data Deletion Request</h3>
          <p>You have the right to request deletion of your personal data at any time. To submit a deletion request:</p>
          <ul>
            <li>Email: <a href="mailto:privacy@roshandigital.com" style={{ color: 'var(--emerald)', textDecoration: 'underline' }}>privacy@roshandigital.com</a> with subject <strong>"Data Deletion Request"</strong></li>
            <li>We will process your request within 30 days and confirm deletion via email</li>
          </ul>
          <p>You also retain rights to: <strong>access</strong> your data, <strong>correct</strong> inaccurate data, <strong>port</strong> your data to another service, and <strong>object</strong> to certain processing (GDPR / CCPA applicable users).</p>

          <h3>7. Children's Privacy (COPPA)</h3>
          <p>Roshan Digital services are not directed to children under the age of 18. We do not knowingly collect personal information from minors. If you believe a minor has provided us data, contact <a href="mailto:privacy@roshandigital.com" style={{ color: 'var(--emerald)' }}>privacy@roshandigital.com</a> immediately.</p>

          <h3>8. Changes to This Policy</h3>
          <p>We may update this policy periodically. We will notify users of significant changes via in-app notification or email. Continued use of the service constitutes acceptance of the updated policy.</p>

          <h3>9. Contact Our Privacy Officer</h3>
          <p>For any privacy inquiries or formal data requests, contact: <a href="mailto:privacy@roshandigital.com" style={{ color: 'var(--emerald)', textDecoration: 'underline' }}>privacy@roshandigital.com</a>.</p>
        </div>
        <footer className="modal-footer">
          <button className="button button-primary" onClick={onClose}>I Understand</button>
        </footer>
      </div>
    </div>
  )
}

function HelpCenterModal({ onClose }: { onClose: () => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const faqs = [
    {
      q: 'How do I download and install the latest APK?',
      a: 'Click the "Download latest APK" button in the App section or header. Once downloaded, tap the file on your Android device (version 8.0+) and follow the on-screen prompts to complete installation.',
    },
    {
      q: 'How does AI-assisted investing work on Roshan Digital?',
      a: 'Our smart algorithms analyze real-time market movements, risk profiles, and automated rebalancing indicators to maximize daily profit potential while maintaining disciplined risk control.',
    },
    {
      q: 'Are my funds and account credentials secure?',
      a: 'Yes. Roshan Digital utilizes multi-factor authentication, cold-storage security protocols, and 256-bit SSL encryption to ensure bank-grade protection for all accounts.',
    },
    {
      q: 'How can I reach 24/7 official support?',
      a: 'You can email our customer assistance team directly at support@roshandigital.com or connect via our verified live support channels.',
    },
  ]

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="modal-title-lockup">
            <img src="/roshan-digital-logo-transparent.png" alt="Roshan Digital" />
            <div>
              <h2>Help Centre</h2>
              <p>Guides, FAQs & 24/7 Official Support</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        </header>
        <div className="modal-body">
          <h3>Frequently Asked Questions</h3>
          {faqs.map((faq, index) => (
            <div className="faq-item" key={faq.q} onClick={() => setOpenFaq(openFaq === index ? null : index)}>
              <div className="faq-question">
                <span>{faq.q}</span>
                <span>{openFaq === index ? '−' : '+'}</span>
              </div>
              {openFaq === index && <div className="faq-answer">{faq.a}</div>}
            </div>
          ))}

          <h3>Need Instant Assistance?</h3>
          <div className="help-contact-cards">
            <a href="mailto:support@roshandigital.com" className="help-card">
              <b>✉ Email Support</b>
              <span>support@roshandigital.com</span>
            </a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); onClose(); }} className="help-card">
              <b>⚡ Live Inquiries</b>
              <span>Contact Page</span>
            </a>
          </div>
        </div>
        <footer className="modal-footer">
          <button className="button button-primary" onClick={onClose}>Close Help Centre</button>
        </footer>
      </div>
    </div>
  )
}

function AboutModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="modal-title-lockup">
            <img src="/roshan-digital-logo-transparent.png" alt="Roshan Digital" />
            <div>
              <h2>About Roshan Digital</h2>
              <p>Secure Investments. Daily Profits. Smarter Decisions with AI.</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        </header>
        <div className="modal-body">
          <h3>Our Mission</h3>
          <p>Roshan Digital is committed to empowering individuals and businesses with intelligent financial tools, algorithmic security, and seamless mobile services built for the future of digital wealth.</p>

          <h3>Key Pillars</h3>
          <ul>
            <li><strong>AI-Driven Intelligence:</strong> Modern algorithmic strategies designed to uncover optimal financial outcomes.</li>
            <li><strong>Transparent Governance:</strong> Zero hidden fees, clear operations, and round-the-clock visibility.</li>
            <li><strong>Enterprise Reliability:</strong> 99.99% system uptime and continuous platform innovations.</li>
          </ul>

          <h3>Official Releases</h3>
          <p>Every version of the Roshan Digital mobile application undergoes rigorous security auditing and cryptographic verification prior to public deployment.</p>
        </div>
        <footer className="modal-footer">
          <button className="button button-primary" onClick={onClose}>Back to Website</button>
        </footer>
      </div>
    </div>
  )
}

function TermsOfServiceModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="modal-title-lockup">
            <img src="/roshan-digital-logo-transparent.png" alt="Roshan Digital" />
            <div>
              <h2>Terms of Service</h2>
              <p>Roshan Digital User Agreement</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        </header>
        <div className="modal-body">
          <p><strong>Effective Date:</strong> August 27, 2026</p>
          <p>
            By downloading, installing, or using the Roshan Digital application or website, you agree to
            be bound by these Terms of Service. Please read them carefully before proceeding.
          </p>

          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing or using any part of Roshan Digital's services, you confirm that you are at
            least 18 years of age, legally capable of entering into binding agreements, and agree to
            comply with these terms and all applicable laws and regulations.
          </p>

          <h3>2. Use of Services</h3>
          <p>
            Roshan Digital grants you a limited, non-exclusive, non-transferable licence to use our
            application and services for lawful personal purposes. You agree not to misuse, reverse
            engineer, or attempt unauthorised access to any part of our platform.
          </p>

          <h3>3. Investment Disclaimer</h3>
          <p>
            All AI-generated insights, portfolio recommendations, and return projections are provided for
            informational purposes only and do not constitute financial or investment advice. Past
            performance does not guarantee future results. Always consult a certified financial advisor
            before making investment decisions.
          </p>

          <h3>4. Account Responsibility</h3>
          <p>
            You are fully responsible for maintaining the confidentiality of your account credentials.
            Roshan Digital is not liable for any loss arising from unauthorised use of your account due
            to your failure to keep login details secure.
          </p>

          <h3>5. Intellectual Property</h3>
          <p>
            All content, branding, code, and designs within the Roshan Digital platform are the exclusive
            intellectual property of Roshan Digital. Unauthorised reproduction or distribution is
            strictly prohibited.
          </p>

          <h3>6. Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by law, Roshan Digital shall not be liable for indirect,
            incidental, or consequential damages arising from your use of our services, including loss of
            profits or data.
          </p>

          <h3>7. Modifications to Terms</h3>
          <p>
            We reserve the right to update these terms at any time. Continued use of the service after
            changes are posted constitutes your acceptance of the revised terms.
          </p>

          <h3>8. Governing Law</h3>
          <p>
            These terms are governed by and construed in accordance with the laws of Pakistan.
            Any disputes shall be subject to the exclusive jurisdiction of the courts of Pakistan.
          </p>

          <h3>9. Contact</h3>
          <p>
            For any questions about these Terms of Service, contact us at:{' '}
            <a href="mailto:legal@roshandigital.com" style={{ color: 'var(--emerald)', textDecoration: 'underline' }}>
              legal@roshandigital.com
            </a>
          </p>
        </div>
        <footer className="modal-footer">
          <button className="button button-primary" onClick={onClose}>I Agree & Close</button>
        </footer>
      </div>
    </div>
  )
}

function AdminLogin({ onLogin, onExit }: { onLogin: (user: AdminUser) => void; onExit: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    const cleanEmail = email.trim().toLowerCase()
    const cleanPassword = password.trim()

    const matchedUser = ADMIN_CREDENTIALS.find(
      (c) =>
        (c.email.toLowerCase() === cleanEmail || cleanEmail === 'shamskhan1335' || cleanEmail === 'admin') &&
        c.password === cleanPassword
    )

    if (matchedUser) {
      const user: AdminUser = {
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
        avatar: matchedUser.avatar,
      }
      if (rememberMe) {
        try {
          localStorage.setItem('rd_admin_session', JSON.stringify(user))
        } catch {
          // ignore
        }
      }
      onLogin(user)
    } else {
      setError('Invalid email or password. Please verify your admin credentials and try again.')
    }
  }

  return (
    <div className="login-shell">
      <div className="login-panel">
        <button className="login-close" onClick={onExit} aria-label="Return to website">×</button>
        <div className="login-brand">
          <img src="/roshan-digital-logo-transparent.png" alt="Roshan Digital" className="login-logo-img" />
        </div>
        <p className="eyebrow">PRIVATE WORKSPACE</p>
        <h1>Welcome back.</h1>
        <p className="login-copy">Sign in to manage your app releases and official news.</p>

        {error && (
          <div className="login-error" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Email or username
            <input
              type="text"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              placeholder=""
              required
              autoFocus
            />
          </label>
          <label>
            Password
            <div className="password-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </label>
          <div className="login-options">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              /> Remember me
            </label>
            <a href="mailto:support@roshandigital.com">Forgot password?</a>
          </div>
          <button className="button button-primary login-button" type="submit">
            Sign in to admin portal <span>→</span>
          </button>
        </form>
        <button className="back-link" onClick={onExit}>← Back to website</button>
        <small className="login-note">Protected workspace · Roshan Digital administration</small>
      </div>
      <div className="login-art">
        <div>
          <span>RD</span>
          <p>Secure operations.<br /><em>Clear direction.</em></p>
        </div>
      </div>
    </div>
  )
}

function AdminDashboard({
  onExit,
  active,
  setActive,
  user,
  newsList,
  setNewsList,
  apkVersions,
  setApkVersions,
  siteSettings,
  setSiteSettings,
}: {
  onExit: () => void
  active: string
  setActive: (item: string) => void
  user: AdminUser | null
  newsList: NewsItem[]
  setNewsList: (items: NewsItem[]) => void
  apkVersions: ApkVersion[]
  setApkVersions: (versions: ApkVersion[]) => void
  siteSettings: SiteSettings
  setSiteSettings: (settings: SiteSettings) => void
}) {
  const menu = ['Dashboard', 'APK management', 'Version history', 'News management', 'Downloads', 'Website settings']
  const displayName = user?.name || 'Shams Khan'
  const displayRole = user?.role || 'Super administrator'
  const displayAvatar = user?.avatar || 'SK'
  const displayEmail = user?.email || 'shamskhan1335@gmail.com'

  const [toastMsg, setToastMsg] = useState('')

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 4000)
  }

  // Calculate live APK & metrics
  const liveApk = apkVersions.find((v) => v.status === 'LIVE') || apkVersions[0]
  const totalDownloadsCount = apkVersions.reduce((acc, curr) => acc + curr.downloads, 0)

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a className="brand" href="#admin">
          <img src="/roshan-digital-logo-transparent.png" alt="Roshan Digital" className="admin-logo-img" />
        </a>
        <p className="admin-label">WORKSPACE</p>
        <div className="admin-menu">
          {menu.map((item, index) => (
            <button className={active === item ? 'active' : ''} key={item} onClick={() => setActive(item)}>
              <span>{['▦', '↥', '◷', '▤', '◒', '⚙'][index]}</span>
              {item}
            </button>
          ))}
        </div>
        <button className="admin-logout" onClick={onExit}>
          ↪ <span>Back to website</span>
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <p className="eyebrow">ADMINISTRATION</p>
            <h1>{active}</h1>
          </div>
          <div className="admin-user" title={displayEmail}>
            <span className="avatar">{displayAvatar}</span>
            <span>
              <b>{displayName}</b>
              <small>{displayRole}</small>
            </span>
            <button onClick={onExit} title="Logout">⌄</button>
          </div>
        </header>

        {toastMsg && (
          <div className="admin-toast">
            <span>✓</span> {toastMsg}
          </div>
        )}

        {/* 1. DASHBOARD */}
        {active === 'Dashboard' && (
          <>
            <div className="stat-grid">
              <div>
                <span>Total downloads</span>
                <b>{totalDownloadsCount.toLocaleString()}</b>
                <small className="positive">↗ 18.4% this month</small>
              </div>
              <div>
                <span>Current app version</span>
                <b>{liveApk.version}</b>
                <small>Released {liveApk.releaseDate}</small>
              </div>
              <div>
                <span>Published news</span>
                <b>{newsList.length}</b>
                <small className="positive">↗ Active online</small>
              </div>
              <div>
                <span>Last APK update</span>
                <b>{liveApk.releaseDate.split(' ')[0]} {liveApk.releaseDate.split(' ')[1]}</b>
                <small>SHA-256 Verified</small>
              </div>
            </div>

            <div className="admin-grid">
              <section className="panel chart-panel">
                <div className="panel-head">
                  <div>
                    <span className="panel-kicker">DOWNLOAD ACTIVITY</span>
                    <h2>Downloads overview</h2>
                  </div>
                  <select><option>Last 30 days</option></select>
                </div>
                <div className="chart">
                  <div className="chart-lines">
                    <span>600</span>
                    <span>400</span>
                    <span>200</span>
                    <span>0</span>
                  </div>
                  <div className="chart-bars">
                    {[32, 48, 41, 60, 50, 68, 54, 72, 64, 84, 75, 92].map((height, index) => (
                      <i key={index} style={{ height: `${height}%` }}></i>
                    ))}
                  </div>
                </div>
                <div className="chart-footer">
                  <span><i></i>Downloads</span>
                  <b>+18.4% <small>vs last month</small></b>
                </div>
              </section>

              <section className="panel release-panel">
                <div className="panel-head">
                  <div>
                    <span className="panel-kicker">LIVE RELEASE</span>
                    <h2>Current APK</h2>
                  </div>
                  <button className="more" onClick={() => setActive('APK management')}>Manage</button>
                </div>
                <div className="release-card">
                  <div className="release-icon">RD</div>
                  <div>
                    <h3>Roshan Digital</h3>
                    <span>Version {liveApk.version} · {liveApk.size}</span>
                  </div>
                  <b className="status-pill">{liveApk.status}</b>
                </div>
                <div className="release-info">
                  <div><span>Release date</span><b>{liveApk.releaseDate}</b></div>
                  <div><span>Minimum Android</span><b>{liveApk.minAndroid}</b></div>
                </div>
                <button className="outline-button" onClick={() => setActive('APK management')}>
                  Manage release <span>→</span>
                </button>
              </section>
            </div>

            <section className="panel activity-panel">
              <div className="panel-head">
                <div>
                  <span className="panel-kicker">RECENT ACTIVITY</span>
                  <h2>What’s happening</h2>
                </div>
                <button className="text-button" onClick={() => setActive('Version history')}>View history <span>→</span></button>
              </div>
              {[
                `APK v${liveApk.version} published to production`,
                `News article “${newsList[0]?.title || 'Latest updates'}” live`,
                `Website settings synced and active`,
              ].map((item, index) => (
                <div className="activity-row" key={item}>
                  <span className={`activity-dot dot-${index}`}></span>
                  <p>
                    <b>{item}</b>
                    <small>{index === 0 ? 'Today, 09:42 AM' : index === 1 ? '18 Aug 2026, 02:18 PM' : 'System automated'}</small>
                  </p>
                  <span className="activity-arrow">→</span>
                </div>
              ))}
            </section>
          </>
        )}

        {/* 2. APK MANAGEMENT */}
        {active === 'APK management' && (
          <AdminApkManagement
            apkVersions={apkVersions}
            setApkVersions={setApkVersions}
            liveApk={liveApk}
            showToast={showToast}
          />
        )}

        {/* 3. VERSION HISTORY */}
        {active === 'Version history' && (
          <AdminVersionHistory
            apkVersions={apkVersions}
            setApkVersions={setApkVersions}
            showToast={showToast}
          />
        )}

        {/* 4. NEWS MANAGEMENT */}
        {active === 'News management' && (
          <AdminNewsManagement
            newsList={newsList}
            setNewsList={setNewsList}
            showToast={showToast}
          />
        )}

        {/* 5. DOWNLOADS ANALYTICS */}
        {active === 'Downloads' && (
          <AdminDownloadsAnalytics
            totalDownloads={totalDownloadsCount}
            apkVersions={apkVersions}
          />
        )}

        {/* 6. WEBSITE SETTINGS */}
        {active === 'Website settings' && (
          <AdminWebsiteSettings
            settings={siteSettings}
            onSave={(newSettings) => {
              setSiteSettings(newSettings)
              showToast('Website settings successfully saved and applied live!')
            }}
          />
        )}
      </main>
    </div>
  )
}

/* ==========================================================================
   ADMIN TAB SUB-COMPONENTS
   ========================================================================== */

function AdminApkManagement({
  apkVersions,
  setApkVersions,
  liveApk,
  showToast,
}: {
  apkVersions: ApkVersion[]
  setApkVersions: (versions: ApkVersion[]) => void
  liveApk: ApkVersion
  showToast: (msg: string) => void
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [versionName, setVersionName] = useState('2.1.0')
  const [buildNumber, setBuildNumber] = useState('210')
  const [fileSize, setFileSize] = useState('49.2 MB')
  const [minAndroid, setMinAndroid] = useState('8.0 and above')
  const [releaseChannel, setReleaseChannel] = useState<'LIVE' | 'BETA'>('LIVE')
  const [changelogText, setChangelogText] = useState(
    'Enhanced AI Investment engine accuracy\nInstant withdrawal settlement\nBug fixes and speed improvements'
  )
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const mb = (file.size / (1024 * 1024)).toFixed(1)
      setFileSize(`${mb} MB`)
    }
  }

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    setTimeout(() => {
      const newApk: ApkVersion = {
        id: `apk-${Date.now()}`,
        version: versionName.trim().replace(/^v/i, ''),
        build: parseInt(buildNumber) || 210,
        releaseDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
        size: fileSize,
        status: releaseChannel,
        minAndroid,
        downloads: 0,
        sha256: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        changelog: changelogText.split('\n').filter((line) => line.trim().length > 0),
        downloadUrl: '/roshan-digital-v2.0.0.apk',
      }

      let updatedList = apkVersions
      if (releaseChannel === 'LIVE') {
        updatedList = updatedList.map((v) => ({
          ...v,
          status: v.status === 'LIVE' ? 'ARCHIVED' : v.status,
        }))
      }

      setApkVersions([newApk, ...updatedList])
      setIsUploading(false)
      setSelectedFile(null)
      showToast(`APK v${newApk.version} successfully published to ${releaseChannel}!`)
    }, 600)
  }

  return (
    <div>
      {/* Current Live Card */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>Current Live Production APK</h3>
            <p>Active release currently serving public downloads on website</p>
          </div>
          <span className="admin-badge live">LIVE PRODUCTION</span>
        </div>

        <div className="admin-form-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <div className="admin-form-group">
            <label>Version Name</label>
            <b style={{ color: '#fff', fontSize: '18px' }}>v{liveApk.version}</b>
          </div>
          <div className="admin-form-group">
            <label>Build Number</label>
            <b style={{ color: '#fff', fontSize: '18px' }}>#{liveApk.build}</b>
          </div>
          <div className="admin-form-group">
            <label>Package Size</label>
            <b style={{ color: '#fff', fontSize: '18px' }}>{liveApk.size}</b>
          </div>
          <div className="admin-form-group">
            <label>Total Downloads</label>
            <b style={{ color: 'var(--emerald)', fontSize: '18px' }}>{liveApk.downloads.toLocaleString()}</b>
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <a href="/roshan-digital-v2.0.0.apk" download className="admin-action-btn">
            ↓ Download Current APK
          </a>
          <button
            type="button"
            className="admin-action-btn"
            onClick={() => showToast('Checksum verified: SHA-256 clean & untampered.')}
          >
            🛡 Verify Integrity
          </button>
        </div>
      </div>

      {/* Upload New Release Form */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>Upload New APK Package</h3>
            <p>Release a new version to the Roshan Digital mobile network</p>
          </div>
        </div>

        <form onSubmit={handlePublish}>
          <div className="admin-form-group full-width" style={{ marginBottom: '18px' }}>
            <label>Select APK Binary File</label>
            <label className="admin-dropzone">
              <span className="admin-dropzone-icon">↥</span>
              <b style={{ color: '#fff', fontSize: '14px' }}>
                {selectedFile ? selectedFile.name : 'Click to select APK file or drag & drop'}
              </b>
              <span style={{ color: '#64748b', fontSize: '12px' }}>
                {selectedFile ? `Size: ${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : 'Supports .apk (Max 150 MB)'}
              </span>
              <input type="file" accept=".apk" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label>Version Name (e.g. 2.1.0)</label>
              <input
                type="text"
                className="admin-input"
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Build Code</label>
              <input
                type="number"
                className="admin-input"
                value={buildNumber}
                onChange={(e) => setBuildNumber(e.target.value)}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Calculated Size</label>
              <input
                type="text"
                className="admin-input"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Minimum Target Android</label>
              <select
                className="admin-select"
                value={minAndroid}
                onChange={(e) => setMinAndroid(e.target.value)}
              >
                <option value="8.0 and above">Android 8.0+ (Oreo - Recommended)</option>
                <option value="10.0 and above">Android 10+ (Q)</option>
                <option value="12.0 and above">Android 12+ (Snow Cone)</option>
                <option value="14.0 and above">Android 14+ (Upside Down Cake)</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Release Channel</label>
              <select
                className="admin-select"
                value={releaseChannel}
                onChange={(e) => setReleaseChannel(e.target.value as 'LIVE' | 'BETA')}
              >
                <option value="LIVE">Live Production (Public Website)</option>
                <option value="BETA">Beta Testing (Early Access)</option>
              </select>
            </div>
            <div className="admin-form-group full-width">
              <label>Release Notes & Changelog (one item per line)</label>
              <textarea
                className="admin-textarea"
                value={changelogText}
                onChange={(e) => setChangelogText(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '22px' }}>
            <button type="submit" className="button button-primary" disabled={isUploading}>
              {isUploading ? 'Verifying & Deploying...' : 'Deploy & Publish APK ↗'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AdminVersionHistory({
  apkVersions,
  setApkVersions,
  showToast,
}: {
  apkVersions: ApkVersion[]
  setApkVersions: (versions: ApkVersion[]) => void
  showToast: (msg: string) => void
}) {
  const [filter, setFilter] = useState<'ALL' | 'LIVE' | 'ARCHIVED' | 'BETA'>('ALL')
  const [search, setSearch] = useState('')

  const filtered = apkVersions.filter((v) => {
    const matchesFilter = filter === 'ALL' || v.status === filter
    const matchesSearch = v.version.toLowerCase().includes(search.toLowerCase()) || v.build.toString().includes(search)
    return matchesFilter && matchesSearch
  })

  const makeLive = (id: string) => {
    const updated = apkVersions.map((v) => {
      if (v.id === id) return { ...v, status: 'LIVE' as const }
      if (v.status === 'LIVE') return { ...v, status: 'ARCHIVED' as const }
      return v
    })
    setApkVersions(updated)
    showToast('Updated active Live production release!')
  }

  const deleteVersion = (id: string) => {
    const item = apkVersions.find((v) => v.id === id)
    if (item?.status === 'LIVE' && apkVersions.length > 1) {
      alert('Cannot delete the current live release. Please set another version live first.')
      return
    }
    if (confirm(`Are you sure you want to delete APK version v${item?.version}?`)) {
      setApkVersions(apkVersions.filter((v) => v.id !== id))
      showToast('Version removed from repository.')
    }
  }

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div>
          <h3>All App Version Releases ({apkVersions.length})</h3>
          <p>Historical archive and rollback management</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            className="admin-input"
            style={{ width: '180px', padding: '8px 12px' }}
            placeholder="Search version..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="admin-select"
            style={{ width: '140px', padding: '8px 12px' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="ALL">All Status</option>
            <option value="LIVE">Live Only</option>
            <option value="ARCHIVED">Archived</option>
            <option value="BETA">Beta</option>
          </select>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Version</th>
              <th>Build</th>
              <th>Release Date</th>
              <th>File Size</th>
              <th>Downloads</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td><b style={{ color: '#fff' }}>v{item.version}</b></td>
                <td>#{item.build}</td>
                <td>{item.releaseDate}</td>
                <td>{item.size}</td>
                <td><b style={{ color: 'var(--emerald)' }}>{item.downloads.toLocaleString()}</b></td>
                <td>
                  <span className={`admin-badge ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  {item.status !== 'LIVE' && (
                    <button className="admin-action-btn" onClick={() => makeLive(item.id)}>
                      Set Live
                    </button>
                  )}
                  <a href={item.downloadUrl} download className="admin-action-btn">
                    ↓ Download
                  </a>
                  {apkVersions.length > 1 && (
                    <button className="admin-action-btn danger" onClick={() => deleteVersion(item.id)}>
                      ✕
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminNewsManagement({
  newsList,
  setNewsList,
  showToast,
}: {
  newsList: NewsItem[]
  setNewsList: (items: NewsItem[]) => void
  showToast: (msg: string) => void
}) {
  const [title, setTitle] = useState('')
  const [tag, setTag] = useState('PRODUCT UPDATE')
  const [color, setColor] = useState('violet')
  const [text, setText] = useState('')
  const [date, setDate] = useState('27 AUG 2026')
  const [isFeatured, setIsFeatured] = useState(false)
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'
  )

  const PRESET_IMAGES = [
    { label: 'Cyber Tech', url: '/news/app-release-v2.jpg' },
    { label: 'Financial AI', url: '/news/digital-journey.jpg' },
    { label: 'Security Vault', url: '/news/cyber-trust.jpg' },
    { label: 'AI Wealth Hero', url: '/news/featured-ai-wealth.jpg' },
  ]

  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault()
    const newItem: NewsItem = {
      id: `news-${Date.now()}`,
      title,
      tag,
      color,
      text,
      date: date || 'Today',
      imageUrl: imageUrl.trim() || undefined,
      featured: isFeatured,
      readTime: '4 MIN READ',
      author: 'Roshan Digital Intelligence',
      highlights: ['+18.4% Monthly Alpha', '256-bit AES Encryption', 'Instant Settlement'],
    }

    let updatedList = newsList
    if (isFeatured) {
      updatedList = updatedList.map((n) => ({ ...n, featured: false }))
    }

    setNewsList([newItem, ...updatedList])
    setTitle('')
    setText('')
    setIsFeatured(false)
    showToast('New article published and live on website!')
  }

  const setAsFeatured = (id: string) => {
    const updated = newsList.map((n) => ({
      ...n,
      featured: n.id === id,
    }))
    setNewsList(updated)
    showToast('Story set as Featured Spotlight!')
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this article from public news?')) {
      setNewsList(newsList.filter((n) => n.id !== id))
      showToast('Article removed from public feed.')
    }
  }

  return (
    <div>
      {/* Create News Form */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>Publish Official News & Story</h3>
            <p>Articles published here appear immediately in the website News section with pictures</p>
          </div>
        </div>

        <form onSubmit={handleAddNews}>
          <div className="admin-form-grid">
            <div className="admin-form-group full-width">
              <label>Article Headline</label>
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. Roshan Digital expands AI portfolio tools"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Category Tag</label>
              <select className="admin-select" value={tag} onChange={(e) => setTag(e.target.value)}>
                <option value="PRODUCT UPDATE">PRODUCT UPDATE</option>
                <option value="INSIGHTS">INSIGHTS</option>
                <option value="OUR STORY">OUR STORY</option>
                <option value="FINANCIAL AI">FINANCIAL AI</option>
                <option value="SECURITY">SECURITY</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Card Color Accent</label>
              <select className="admin-select" value={color} onChange={(e) => setColor(e.target.value)}>
                <option value="violet">Violet Glow</option>
                <option value="blue">Electric Cyan / Blue</option>
                <option value="gold">Luminous Gold</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Publication Date</label>
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. 27 AUG 2026"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Cover Picture URL</label>
              <input
                type="text"
                className="admin-input"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                {PRESET_IMAGES.map((p) => (
                  <button
                    type="button"
                    key={p.label}
                    className="admin-action-btn"
                    style={{ fontSize: '10px', padding: '3px 8px' }}
                    onClick={() => setImageUrl(p.url)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="admin-form-group full-width">
              <label>Article Excerpt & Description</label>
              <textarea
                className="admin-textarea"
                placeholder="Provide a clear, engaging overview of the announcement..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              />
            </div>
            <div className="admin-form-group full-width">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#fff' }}>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                ⭐ Set as Featured Spotlight Article (Prominently displayed at top of website)
              </label>
            </div>
          </div>
          <div style={{ marginTop: '18px' }}>
            <button type="submit" className="button button-primary">
              Publish Story with Picture <span>→</span>
            </button>
          </div>
        </form>
      </div>

      {/* Published News List */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>Published News Feed ({newsList.length})</h3>
            <p>Manage existing news items on the website</p>
          </div>
        </div>

        <div className="admin-news-grid">
          {newsList.map((item) => (
            <div className="admin-news-card" key={item.id}>
              {item.imageUrl && (
                <img src={item.imageUrl} alt="" className="admin-news-thumb" />
              )}
              <div className="admin-news-info" style={{ flex: 1 }}>
                <div className="admin-news-meta">
                  <span className={`admin-badge ${item.color}`}>{item.tag}</span>
                  {item.featured && (
                    <span className="admin-badge live" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.4)' }}>
                      ★ FEATURED
                    </span>
                  )}
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{item.date}</span>
                </div>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {!item.featured && (
                  <button
                    className="admin-action-btn"
                    onClick={() => setAsFeatured(item.id)}
                    title="Set as featured story"
                  >
                    ★ Feature
                  </button>
                )}
                <button
                  className="admin-action-btn danger"
                  onClick={() => handleDelete(item.id)}
                  title="Delete article"
                >
                  Delete ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AdminDownloadsAnalytics({
  totalDownloads,
  apkVersions,
}: {
  totalDownloads: number
  apkVersions: ApkVersion[]
}) {
  const exportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Version,Build,ReleaseDate,FileSize,Downloads,Status\n' +
      apkVersions
        .map((v) => `"${v.version}",${v.build},"${v.releaseDate}","${v.size}",${v.downloads},"${v.status}"`)
        .join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `roshan_digital_downloads_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div>
      {/* KPI Cards */}
      <div className="stat-grid" style={{ marginBottom: '22px' }}>
        <div>
          <span>Total APK Downloads</span>
          <b>{totalDownloads.toLocaleString()}</b>
          <small className="positive">↗ 18.4% monthly increase</small>
        </div>
        <div>
          <span>Today's Installs</span>
          <b>+342</b>
          <small className="positive">↗ Peak at 09:30 AM</small>
        </div>
        <div>
          <span>Active Device Installs</span>
          <b>9,820</b>
          <small>78.8% retention rate</small>
        </div>
        <div>
          <span>Crash-Free Sessions</span>
          <b>99.8%</b>
          <small className="positive">Verified stability</small>
        </div>
      </div>

      <div className="admin-analytics-grid">
        {/* Geo Distribution */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Geographical Distribution</h3>
          </div>
          {[
            { country: 'Pakistan', pct: 48 },
            { country: 'United Arab Emirates', pct: 24 },
            { country: 'United Kingdom', pct: 12 },
            { country: 'Saudi Arabia', pct: 9 },
            { country: 'United States & Others', pct: 7 },
          ].map((g) => (
            <div className="admin-progress-item" key={g.country}>
              <div className="admin-progress-label">
                <span>{g.country}</span>
                <b>{g.pct}%</b>
              </div>
              <div className="admin-progress-track">
                <div className="admin-progress-bar" style={{ width: `${g.pct}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Device Distribution */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Device Manufacturer Share</h3>
          </div>
          {[
            { brand: 'Samsung Galaxy Series', pct: 42 },
            { brand: 'Xiaomi / Redmi / POCO', pct: 26 },
            { brand: 'Infinix / Tecno', pct: 18 },
            { brand: 'Vivo & Oppo', pct: 14 },
          ].map((d) => (
            <div className="admin-progress-item" key={d.brand}>
              <div className="admin-progress-label">
                <span>{d.brand}</span>
                <b>{d.pct}%</b>
              </div>
              <div className="admin-progress-track">
                <div className="admin-progress-bar" style={{ width: `${d.pct}%`, background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Download Logs Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>Live Download Log Events</h3>
            <p>Real-time telemetry of recent package downloads</p>
          </div>
          <button className="admin-action-btn" onClick={exportCsv}>
            📥 Export CSV Report
          </button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Location / IP</th>
                <th>Device</th>
                <th>Version</th>
                <th>Speed</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { time: 'Just now', loc: 'Lahore, PK (119.160.*)', dev: 'Samsung SM-S928B (Android 14)', ver: 'v2.0.0', speed: '42 MB/s' },
                { time: '3 mins ago', loc: 'Dubai, UAE (94.200.*)', dev: 'Xiaomi 23116PN5BC (Android 14)', ver: 'v2.0.0', speed: '58 MB/s' },
                { time: '8 mins ago', loc: 'Karachi, PK (39.40.*)', dev: 'Infinix X6833B (Android 13)', ver: 'v2.0.0', speed: '24 MB/s' },
                { time: '14 mins ago', loc: 'London, UK (86.14.*)', dev: 'Google Pixel 8 Pro (Android 15)', ver: 'v2.0.0', speed: '70 MB/s' },
                { time: '22 mins ago', loc: 'Riyadh, SA (212.11.*)', dev: 'Vivo V2303 (Android 14)', ver: 'v2.0.0', speed: '36 MB/s' },
              ].map((row, index) => (
                <tr key={index}>
                  <td>{row.time}</td>
                  <td><b style={{ color: '#fff' }}>{row.loc}</b></td>
                  <td>{row.dev}</td>
                  <td><span className="admin-badge live">{row.ver}</span></td>
                  <td>{row.speed}</td>
                  <td><span style={{ color: 'var(--emerald)', fontWeight: 'bold' }}>✓ Completed</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function AdminWebsiteSettings({
  settings,
  onSave,
}: {
  settings: SiteSettings
  onSave: (newSettings: SiteSettings) => void
}) {
  const [formData, setFormData] = useState<SiteSettings>(settings)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div>
          <h3>Website Content & Global Settings</h3>
          <p>Update live text, announcement banners, contact info and security settings</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          {/* Announcement Settings */}
          <div className="admin-form-group full-width">
            <label>Announcement Bar Text</label>
            <input
              type="text"
              className="admin-input"
              value={formData.announcementText}
              onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Hero Title Headline</label>
            <input
              type="text"
              className="admin-input"
              value={formData.heroTitle}
              onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Official Support Email</label>
            <input
              type="email"
              className="admin-input"
              value={formData.supportEmail}
              onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
              required
            />
          </div>

          <div className="admin-form-group full-width">
            <label>Hero Subtitle / Description</label>
            <textarea
              className="admin-textarea"
              value={formData.heroSubtitle}
              onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Primary APK Download Path / URL</label>
            <input
              type="text"
              className="admin-input"
              value={formData.apkDownloadUrl}
              onChange={(e) => setFormData({ ...formData, apkDownloadUrl: e.target.value })}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Telegram Community / Official Channel</label>
            <input
              type="text"
              className="admin-input"
              value={formData.telegramLink}
              onChange={(e) => setFormData({ ...formData, telegramLink: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Switches */}
        <div style={{ marginTop: '24px', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
          <div className="admin-switch-row">
            <div className="admin-switch-info">
              <b>Enable Announcement Banner</b>
              <span>Display the top notification bar across the website</span>
            </div>
            <label className="admin-switch">
              <input
                type="checkbox"
                checked={formData.announcementActive}
                onChange={(e) => setFormData({ ...formData, announcementActive: e.target.checked })}
              />
              <span className="admin-slider"></span>
            </label>
          </div>

          <div className="admin-switch-row">
            <div className="admin-switch-info">
              <b>Maintenance Mode</b>
              <span>Temporary hold on public registrations & releases</span>
            </div>
            <label className="admin-switch">
              <input
                type="checkbox"
                checked={formData.maintenanceMode}
                onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
              />
              <span className="admin-slider"></span>
            </label>
          </div>
        </div>

        <div style={{ marginTop: '26px' }}>
          <button type="submit" className="button button-primary">
            Save Website Settings <span>✓</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default App
