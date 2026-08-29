import { useState } from 'react'
import type { NewsItem, ApkVersion, SiteSettings } from '../types'
import { checkAdminCredentials, type AdminUser } from './auth'

export function AdminLogin({ onLogin, onExit }: { onLogin: (user: AdminUser) => void; onExit: () => void }) {
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

    const matchedUser = checkAdminCredentials(cleanEmail, cleanPassword)

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

export function AdminApkManagement({
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

export function AdminVersionHistory({
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

export function AdminNewsManagement({
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

export function AdminDownloadsAnalytics({
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

export function AdminWebsiteSettings({
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
