import { useState } from 'react'
import type { SiteSettings } from '../../types'

export function AdminWebsiteSettings({
  settings,
  onSave,
}: {
  settings: SiteSettings
  onSave: (newSettings: SiteSettings) => void
}) {
  const [formData, setFormData] = useState<SiteSettings>(settings)
  const [lastSettings, setLastSettings] = useState<SiteSettings>(settings)

  // Sync the form when the parent provides a NEW settings object (saves from
  // elsewhere), without a setState-in-effect. Adjusting state during render is
  // the React-recommended pattern for this.
  if (lastSettings !== settings) {
    setLastSettings(settings)
    setFormData(settings)
  }


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
