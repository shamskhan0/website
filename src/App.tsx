import { useState } from 'react'
import './App.css'
import './brand.css'
import './hero-theme.css'
import './center-hero.css'
import './login-theme.css'
import { AnnouncementBar, HeroSection, SiteHeader } from './sections/HeaderHero'
import { AppReleaseSection, AppScreenshotsSection, FeaturesSection } from './sections/FeaturesAndRelease'
import { ContactSection, NewsSection } from './sections/NewsAndContact'
import { SiteFooter, TrustStrip } from './sections/Footer'
import { ArticleReaderModal } from './modals'
import { HelpCenterModal } from './modals'
import { PrivacyPolicyModal } from './modals'
import { AboutModal } from './modals'
import { TermsOfServiceModal } from './modals'
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
  typeof (v as SiteSettings).supportEmail === 'string'

const isAdminUser = (v: unknown): v is AdminUser =>
  v !== null && typeof v === 'object' &&
  typeof (v as AdminUser).name === 'string' &&
  typeof (v as AdminUser).email === 'string'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [activeModal, setActiveModal] = useState<'help' | 'privacy' | 'about' | 'terms' | null>(null)
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
      return <AdminLogin onLogin={handleLogin} onExit={() => setAdminOpen(false)} />
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

      <SiteHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} onOpenAbout={() => setActiveModal('about')} />

      <main id="top">
        <HeroSection siteSettings={siteSettings} liveApk={liveApk} />
        <TrustStrip />
        <FeaturesSection features={featuresList} onOpenAbout={() => setActiveModal('about')} />
        <AppReleaseSection liveApk={liveApk} siteSettings={siteSettings} />
        <AppScreenshotsSection />
        <NewsSection newsList={newsList} onSelectArticle={setSelectedArticle} />
        <ContactSection siteSettings={siteSettings} />
      </main>

      <SiteFooter
        onOpenAbout={() => setActiveModal('about')}
        onOpenHelp={() => setActiveModal('help')}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Interactive Modals */}
      {activeModal === 'privacy' && <PrivacyPolicyModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'help' && <HelpCenterModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'about' && <AboutModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'terms' && <TermsOfServiceModal onClose={() => setActiveModal(null)} />}
      {selectedArticle && <ArticleReaderModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />}
    </div>
  )
}


export default App
