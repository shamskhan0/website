import type { ApkVersion } from '../../types'

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
