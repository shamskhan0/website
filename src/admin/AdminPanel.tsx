import { useEffect, useRef, useState } from 'react'
import { checkAdminCredentials, type AdminUser } from './auth'
import { DashboardTab } from './tabs/DashboardTab'
import { AdminApkManagement } from './tabs/AdminApkManagement'
import { AdminVersionHistory } from './tabs/AdminVersionHistory'
import { AdminNewsManagement } from './tabs/AdminNewsManagement'
import { AdminDownloadsAnalytics } from './tabs/AdminDownloadsAnalytics'
import { AdminWebsiteSettings } from './tabs/AdminWebsiteSettings'
import type { NewsItem, ApkVersion, SiteSettings } from '../types'

export function AdminLogin({ onLogin, onExit }: { onLogin: (user: AdminUser) => void; onExit: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [isChecking, setIsChecking] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setIsChecking(true)

    const matchedUser = await checkAdminCredentials(email.trim().toLowerCase(), password.trim())
    setIsChecking(false)

    if (matchedUser) {
      if (rememberMe) {
        try {
          localStorage.setItem('rd_admin_session', JSON.stringify(matchedUser))
        } catch {
          // ignore
        }
      }
      onLogin(matchedUser)
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
          <button className="button button-primary login-button" type="submit" disabled={isChecking}>
            {isChecking ? 'Verifying...' : <>Sign in to admin portal <span>?</span></>}
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

export function AdminDashboard({
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
  const displayName = user?.name ?? 'Administrator'
  const displayRole = user?.role ?? 'Administrator'
  const displayAvatar = user?.avatar ?? '—'
  const displayEmail = user?.email ?? ''

  const [toastMsg, setToastMsg] = useState('')
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = (msg: string) => {
    setToastMsg(msg)
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setToastMsg(''), 4000)
  }

  // Clear any pending toast timer when the dashboard unmounts (e.g. on logout)
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    }
  }, [])

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
          <DashboardTab
            newsList={newsList}
            liveApk={liveApk}
            totalDownloadsCount={totalDownloadsCount}
            setActive={setActive}
          />
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
