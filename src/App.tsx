import { useState } from 'react'
import './App.css'
import './brand.css'
import './mobile-responsive.css'
import './hero-theme.css'
import './center-hero.css'
import './login-theme.css'
import './pages.css'
import { AnnouncementBar, HeroSection, SiteHeader } from './sections/HeaderHero'
import { AppReleaseSection, AppScreenshotsSection, FeaturesSection } from './sections/FeaturesAndRelease'
import { ContactSection, NewsSection } from './sections/NewsAndContact'
import { SiteFooter } from './sections/Footer'
import { ArticleReaderModal } from './modals'
import { HelpCenterModal } from './modals'
import { PrivacyPolicyModal } from './modals'
import { AboutModal } from './modals'
import { TermsOfServiceModal } from './modals'
import { DisclaimerModal, CookiePolicyModal } from './modals'
import { AdminLogin, AdminDashboard } from './admin/AdminPanel'
import type { AdminUser } from './admin/auth'

import type { FeatureItem, NewsItem, ApkVersion, SiteSettings } from './types'
import { INITIAL_FEATURES, INITIAL_NEWS, INITIAL_APK_VERSIONS, INITIAL_SITE_SETTINGS } from './data'
import { loadPersisted, usePersistedState } from './persistence'

// Shape validators — reject anything malformed so JSON.parse output is never
// trusted blindly (corrupt/tampered localStorage falls back to defaults).
const isFeatureList = (v: unknown): v is FeatureItem[] =>
  Array.isArray(v) && v.every((f) =>
    f !== null && typeof f === 'object' &&
    typeof (f as FeatureItem).id === 'string' &&
    typeof (f as FeatureItem).title === 'string' &&
    typeof (f as FeatureItem).text === 'string' &&
    typeof (f as FeatureItem).image === 'string',
  )

const isNewsList = (v: unknown): v is NewsItem[] =>
  Array.isArray(v) && v.every((n) =>
    n !== null && typeof n === 'object' &&
    typeof (n as NewsItem).id === 'string' &&
    typeof (n as NewsItem).title === 'string' &&
    typeof (n as NewsItem).text === 'string' &&
    typeof (n as NewsItem).date === 'string',
  )

const isApkVersions = (v: unknown): v is ApkVersion[] =>
  Array.isArray(v) && v.every((a) =>
    a !== null && typeof a === 'object' &&
    typeof (a as ApkVersion).id === 'string' &&
    typeof (a as ApkVersion).version === 'string' &&
    typeof (a as ApkVersion).build === 'number' &&
    Array.isArray((a as ApkVersion).changelog),
  )

const isSiteSettings = (v: unknown): v is SiteSettings =>
  v !== null && typeof v === 'object' &&
  typeof (v as SiteSettings).announcementText === 'string' &&
  typeof (v as SiteSettings).announcementActive === 'boolean' &&
  typeof (v as SiteSettings).heroTitle === 'string' &&
  typeof (v as SiteSettings).supportEmail === 'string' &&
  typeof (v as SiteSettings).images === 'object' &&
  (v as SiteSettings).images !== null

const isAdminUser = (v: unknown): v is AdminUser =>
  v !== null && typeof v === 'object' &&
  typeof (v as AdminUser).name === 'string' &&
  typeof (v as AdminUser).email === 'string'

function TrustHighlightsBar() {
  const items = [
    { icon: '◎', label: 'Secure Experience' },
    { icon: '↗', label: 'Fast Digital Access' },
    { icon: '◌', label: 'Easy to Use' },
    { icon: '⏱', label: '24/7 Accessibility' },
  ]

  return (
    <section className="trust-highlights-bar" aria-label="Roshan Digital trust highlights">
      {items.map((item) => (
        <div className="trust-highlight-item" key={item.label}>
          <span className="trust-highlight-icon">{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </section>
  )
}

function HowItWorksSection() {
  const steps = [
    { id: '01', title: 'Download the App', text: 'Get the Roshan Digital app and start your digital experience in just a few steps.' },
    { id: '02', title: 'Create Your Account', text: 'Set up your profile with a simple, guided account flow and secure access.' },
    { id: '03', title: 'Start Using Roshan Digital', text: 'Use a clean dashboard designed for speed, clarity and everyday convenience.' },
  ]

  return (
    <section className="section how-it-works-section">
      <div className="section-heading how-it-works-heading">
        <p className="eyebrow">HOW IT WORKS <span></span></p>
        <h2>Three simple steps.<br /><em>Built for clarity.</em></h2>
      </div>
      <div className="steps-grid">
        {steps.map((step) => (
          <div className="step-card" key={step.id}>
            <div className="step-number">{step.id}</div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function WhyRoshanDigitalSection() {
  const benefits = [
    { icon: '◈', title: 'Simple Experience', text: 'Clear navigation, clean flows, and a faster digital journey from start to finish.' },
    { icon: '◇', title: 'Modern Interface', text: 'Thoughtful design built to feel premium, intuitive and calm to use.' },
    { icon: '◎', title: 'Easy Access', text: 'Quick access to the app, account tools and essential digital services without friction.' },
    { icon: '✦', title: 'Transparent Information', text: 'Relevant updates, direct access and clear communication throughout the experience.' },
  ]

  return (
    <section className="section why-section">
      <div className="section-heading">
        <p className="eyebrow">WHY ROSHAN DIGITAL <span></span></p>
        <h2>Designed to keep your digital life<br /><em>simple and confident.</em></h2>
      </div>
      <div className="why-grid">
        {benefits.map((item) => (
          <div className="why-card" key={item.title}>
            <div className="why-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function StatsHighlightSection() {
  const stats = [
    { title: 'Digital access', value: 'Fast, guided access' },
    { title: 'Release updates', value: 'Regular improvements' },
    { title: 'Support access', value: 'Helpful guidance' },
    { title: 'Trusted digital experience', value: 'Built for clarity' },
  ]

  return (
    <section className="section stats-section">
      <div className="section-heading stats-heading">
        <p className="eyebrow">ROSHAN DIGITAL EXPERIENCE <span></span></p>
        <h2>Thoughtful tools for a better<br /><em>digital experience.</em></h2>
      </div>
      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stats-card" key={stat.title}>
            <span>{stat.title}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}

function AppJourneySection() {
  const steps = ['Dashboard', 'Quick Access', 'Transactions', 'Records', 'Account']

  return (
    <section className="section journey-section">
      <div className="section-heading">
        <p className="eyebrow">APP EXPERIENCE <span></span></p>
        <h2>From opening the app to everyday use,<br /><em>everything feels simpler.</em></h2>
      </div>
      <div className="journey-track" aria-label="Roshan Digital app journey">
        {steps.map((step, index) => (
          <div className="journey-node" key={step}>
            <span className="journey-step">{index + 1}</span>
            <b>{step}</b>
          </div>
        ))}
      </div>
    </section>
  )
}

function SecuritySection() {
  return (
    <section className="section security-section">
      <div className="security-content">
        <p className="eyebrow">SECURITY & TRUST <span></span></p>
        <h2>Protection designed around<br /><em>responsible digital confidence.</em></h2>
        <p>
          Roshan Digital is built to help users move through their digital experience with clarity,
          structure and confident access. Security is treated as part of the experience, with privacy-aware
          flows and reliable account handling across the platform.
        </p>
        <ul className="security-list">
          <li>Verified access and account workflows</li>
          <li>Privacy-conscious digital experience</li>
          <li>Clear, easy-to-follow onboarding</li>
        </ul>
      </div>
      <div className="security-visual" aria-hidden="true">
        <div className="shield-glow"></div>
        <div className="security-shield">◎</div>
        <div className="floating-ring ring-one"></div>
        <div className="floating-ring ring-two"></div>
      </div>
    </section>
  )
}

function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const faqs = [
    {
      q: 'How do I download and install the latest APK?',
      a: 'Use the download button in the app section or the final call-to-action area. Android users can install the APK directly after downloading it.',
    },
    {
      q: 'Do I need to create an account before using the app?',
      a: 'The app experience is designed around a guided account flow so users can get started with a clear, simple onboarding process.',
    },
    {
      q: 'Can I access the portfolio and app experience on mobile?',
      a: 'Yes. The interface is designed to be mobile-friendly and access-friendly for everyday use on modern mobile devices.',
    },
    {
      q: 'Where can I find support or updates?',
      a: 'Support information and news updates are available through the website sections and the official contact and help pathways.',
    },
  ]

  return (
    <section className="section faq-section">
      <div className="section-heading faq-heading">
        <p className="eyebrow">FAQ <span></span></p>
        <h2>Quick answers to common questions.</h2>
      </div>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={faq.q} className={`faq-item ${openFaq === index ? 'open' : ''}`} onClick={() => setOpenFaq(openFaq === index ? null : index)}>
            <div className="faq-question">
              <span>{faq.q}</span>
              <span>{openFaq === index ? '−' : '+'}</span>
            </div>
            {openFaq === index && <div className="faq-answer">{faq.a}</div>}
          </div>
        ))}
      </div>
    </section>
  )
}

function FinalDownloadCta({ siteSettings }: { siteSettings: SiteSettings }) {
  const heroImage = siteSettings.images?.hero_mobile_image?.url || '/app-screenshot.jpg'

  return (
    <section className="final-cta-section">
      <div className="final-cta-visual" aria-hidden="true">
        <div className="cta-glass-ring"></div>
        <div className="cta-phone">
          <img src={heroImage} alt="Roshan Digital app" className="cta-phone-image" />
        </div>
      </div>
      <div className="final-cta-copy">
        <p className="eyebrow">DOWNLOAD APP <span></span></p>
        <h2>Experience Roshan Digital</h2>
        <p>Discover a modern digital experience designed around simplicity and convenience.</p>
        <div className="hero-actions">
          <a className="button button-primary" href={siteSettings.apkDownloadUrl} download>Download App <span>↓</span></a>
        </div>
      </div>
    </section>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [activeModal, setActiveModal] = useState<'help' | 'privacy' | 'about' | 'terms' | 'disclaimer' | 'cookie' | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null)

  // Dynamic Data States saved in localStorage (validated + safe fallback).
  // usePersistedState writes through to localStorage on every update.
  const [featuresList, setFeaturesList] = usePersistedState('rd_features_data_v1', INITIAL_FEATURES, isFeatureList)

  const [newsList, setNewsList] = usePersistedState('rd_news_data_v3', INITIAL_NEWS, isNewsList)

  const [apkVersions, setApkVersions] = usePersistedState('rd_apk_versions', INITIAL_APK_VERSIONS, isApkVersions)

  const [siteSettings, setSiteSettings] = usePersistedState('rd_site_settings', INITIAL_SITE_SETTINGS, isSiteSettings)

  const [currentUser, setCurrentUser] = useState<AdminUser | null>(
    () => loadPersisted<AdminUser | null>('rd_admin_session', null, isAdminUser),
  )
  // Derived from the validated currentUser so a corrupt/tampered session
  // always routes to the login screen instead of a dashboard with no user.
  const adminLoggedIn = currentUser !== null
  const [activeAdmin, setActiveAdmin] = useState('Dashboard')

  // Live active APK
  const liveApk = apkVersions.find((v) => v.status === 'LIVE') || apkVersions[0]

  const handleLogin = (user: AdminUser) => {
    setCurrentUser(user)
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem('rd_admin_session')
    } catch {
      // ignore
    }
    setCurrentUser(null)
    setAdminOpen(false)
  }

  if (adminOpen) {
    if (!adminLoggedIn) {
      return <AdminLogin
      onLogin={handleLogin}
      onExit={() => setAdminOpen(false)}
      brandLogoUrl={siteSettings.images?.app_logo?.url || '/roshan-digital-logo-transparent.png'}
    />
    }
    return (
      <AdminDashboard
        user={currentUser}
        onExit={handleLogout}
        active={activeAdmin}
        setActive={setActiveAdmin}
        featuresList={featuresList}
        setFeaturesList={setFeaturesList}
        newsList={newsList}
        setNewsList={setNewsList}
        apkVersions={apkVersions}
        setApkVersions={setApkVersions}
        siteSettings={siteSettings}
        setSiteSettings={setSiteSettings}
      />
    )
  }

  return (
    <div className="site-shell">
      <AnnouncementBar siteSettings={siteSettings} />

      <SiteHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} onOpenAbout={() => setActiveModal('about')} siteSettings={siteSettings} />

      <main id="top">
        <HeroSection siteSettings={siteSettings} liveApk={liveApk} />
        <TrustHighlightsBar />
        <HowItWorksSection />
        <FeaturesSection features={featuresList} onOpenAbout={() => setActiveModal('about')} />
        <AppReleaseSection liveApk={liveApk} siteSettings={siteSettings} />
        <AppScreenshotsSection />
        <WhyRoshanDigitalSection />
        <StatsHighlightSection />
        <AppJourneySection />
        <SecuritySection />
        <FaqSection />
        <FinalDownloadCta siteSettings={siteSettings} />
        <NewsSection newsList={newsList} onSelectArticle={setSelectedArticle} />
        <ContactSection siteSettings={siteSettings} />
      </main>

      <SiteFooter
        onOpenAbout={() => setActiveModal('about')}
        onOpenHelp={() => setActiveModal('help')}
        onOpenAdmin={() => setAdminOpen(true)}
        siteSettings={siteSettings}
        onOpenDisclaimer={() => setActiveModal('disclaimer')}
        onOpenCookiePolicy={() => setActiveModal('cookie')}
      />

      {/* Interactive Modals */}
      {activeModal === 'privacy' && <PrivacyPolicyModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'help' && <HelpCenterModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'about' && <AboutModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'terms' && <TermsOfServiceModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'disclaimer' && <DisclaimerModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'cookie' && <CookiePolicyModal onClose={() => setActiveModal(null)} />}
      {selectedArticle && <ArticleReaderModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />}
    </div>
  )
}


export default App
