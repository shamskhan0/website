import type { NewsItem, ApkVersion } from '../../types'

export function DashboardTab({
  newsList,
  liveApk,
  totalDownloadsCount,
  setActive,
}: {
  newsList: NewsItem[]
  liveApk: ApkVersion
  totalDownloadsCount: number
  setActive: (item: string) => void
}) {
  return (
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
  )
}
