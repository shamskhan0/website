import { useState } from 'react'
import type { ApkVersion, SiteSettings } from '../../types'
import { promoteToLive } from '../apkStatus'
import { downloadApkFile } from '../../apkDownload'
import { pushCloudSettings, cloudSyncEnabled } from '../../cloudSync'

const STATUS_FILTERS = ['ALL', 'LIVE', 'ARCHIVED', 'BETA'] as const
type StatusFilter = (typeof STATUS_FILTERS)[number]

export function AdminVersionHistory({
  apkVersions,
  setApkVersions,
  showToast,
  siteSettings,
  setSiteSettings,
}: {
  apkVersions: ApkVersion[]
  setApkVersions: (versions: ApkVersion[]) => void
  showToast: (msg: string) => void
  siteSettings: SiteSettings
  setSiteSettings: (s: SiteSettings) => void
}) {
  const [filter, setFilter] = useState<StatusFilter>('ALL')
  const [search, setSearch] = useState('')

  const filtered = apkVersions.filter((v) => {
    const matchesFilter = filter === 'ALL' || v.status === filter
    const matchesSearch = v.version.toLowerCase().includes(search.toLowerCase()) || v.build.toString().includes(search)
    return matchesFilter && matchesSearch
  })

  // Live version badalne par site ka global download URL bhi us APK par point karo
  const makeLive = (id: string) => {
    const next = promoteToLive(apkVersions, id)
    const live = next.find((v) => v.id === id)
    setApkVersions(next)
    if (live && live.downloadUrl && !live.downloadUrl.startsWith('/')) {
      const nextSettings = { ...siteSettings, apkDownloadUrl: live.downloadUrl }
      setSiteSettings(nextSettings)
      if (cloudSyncEnabled) void pushCloudSettings(nextSettings)
    }
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
            onChange={(e) => {
              const value = e.target.value as StatusFilter
              if (STATUS_FILTERS.includes(value)) setFilter(value)
            }}
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
                  <a
                    href={item.downloadUrl}
                    download
                    onClick={(e) => {
                      e.preventDefault()
                      void downloadApkFile(item.downloadUrl, showToast)
                    }}
                    className="admin-action-btn"
                  >
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
