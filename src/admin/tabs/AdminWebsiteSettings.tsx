import { useState } from 'react'
import type { ManagedImage, SiteSettings } from '../../types'

const IMAGE_CONFIG = [
  {
    key: 'hero_mobile_image',
    label: 'Hero Mobile Image',
    fallback: '/app-screenshot.jpg',
    recommended: 'Recommended: 900 x 1600px · JPG or PNG · Max 3MB',
    description: 'Primary app mockup used in the hero header across the website.',
  },
  {
    key: 'hero_background',
    label: 'Hero Background',
    fallback: '/features/fast-reliable.jpg',
    recommended: 'Recommended: 1600 x 900px · JPG or PNG · Max 3MB',
    description: 'Hero background artwork used in additional variations and layouts.',
  },
  {
    key: 'app_logo',
    label: 'App Logo',
    fallback: '/roshan-digital-logo-transparent.png',
    recommended: 'Recommended: 512 x 512px · PNG or SVG · Max 2MB',
    description: 'Brand logo used across the public site.',
  },
] as const

const createManagedImage = (key: string, url: string, fileName: string = 'uploaded-image'): ManagedImage => ({
  key,
  url,
  fileName,
  uploadDate: new Date().toISOString(),
  updatedDate: new Date().toISOString(),
  active: !!url,
  version: 1,
})

export function AdminWebsiteSettings({
  settings,
  onSave,
}: {
  settings: SiteSettings
  onSave: (newSettings: SiteSettings) => void
}) {
  const [formData, setFormData] = useState<SiteSettings>(settings)
  const [lastSettings, setLastSettings] = useState<SiteSettings>(settings)
  const [statusMessage, setStatusMessage] = useState('')

  if (lastSettings !== settings) {
    setLastSettings(settings)
    setFormData(settings)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    setStatusMessage('Website settings saved and image assignments updated.')
  }

  const handleImageUpload = (key: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      setStatusMessage('Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.')
      return
    }

    if (file.size > 3 * 1024 * 1024) {
      setStatusMessage('File too large. Please upload an image under 3MB for best results.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const nextUrl = typeof reader.result === 'string' ? reader.result : ''

      if (!nextUrl) {
        setStatusMessage('Upload failed. Please try a different image file.')
        return
      }

      const current = formData.images?.[key]
      const nextImage: ManagedImage = {
        ...(current ?? createManagedImage(key, '', file.name)),
        key,
        url: nextUrl,
        fileName: file.name,
        uploadDate: current?.uploadDate ?? new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        active: true,
        version: (current?.version ?? 0) + 1,
      }

      setFormData((prev) => ({
        ...prev,
        images: {
          ...(prev.images ?? {}),
          [key]: nextImage,
        },
      }))
      setStatusMessage(`${key.replace(/_/g, ' ')} updated successfully.`)
    }
    reader.readAsDataURL(file)
  }

  const handleImageDelete = (key: string) => {
    const current = formData.images?.[key]
    const nextImage: ManagedImage = {
      ...(current ?? createManagedImage(key, '')),
      key,
      url: '',
      fileName: current?.fileName ?? 'deleted-image',
      updatedDate: new Date().toISOString(),
      active: false,
      version: (current?.version ?? 0) + 1,
    }

    setFormData((prev) => ({
      ...prev,
      images: {
        ...(prev.images ?? {}),
        [key]: nextImage,
      },
    }))
    setStatusMessage(`${key.replace(/_/g, ' ')} removed from the managed image set.`)
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

        <div style={{ marginTop: '26px' }}>
          <div className="admin-card" style={{ marginBottom: '18px' }}>
            <div className="admin-card-header">
              <div>
                <h3>Centralized Image Management</h3>
                <p>One upload updates all sections that use the same managed image key.</p>
              </div>
            </div>

            {statusMessage && (
              <div className="admin-toast" style={{ marginBottom: '16px' }}>
                <span>✓</span> {statusMessage}
              </div>
            )}

            <div style={{ display: 'grid', gap: '18px' }}>
              {IMAGE_CONFIG.map((imageConfig) => {
                const currentImage = formData.images?.[imageConfig.key]
                const activeUrl = currentImage?.url || imageConfig.fallback
                const isActive = Boolean(currentImage?.active && currentImage?.url)

                return (
                  <div key={imageConfig.key} style={{ border: '1px solid var(--line)', borderRadius: '12px', padding: '16px', background: 'rgba(15, 23, 42, 0.5)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <div>
                        <b style={{ display: 'block', marginBottom: '4px' }}>{imageConfig.label}</b>
                        <small style={{ color: '#94a3b8' }}>{imageConfig.description}</small>
                      </div>
                      <span style={{ fontSize: '11px', padding: '5px 8px', borderRadius: '999px', background: isActive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(148, 163, 184, 0.12)', color: isActive ? '#34d399' : '#cbd5e1' }}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <label className="admin-action-btn" htmlFor={`${imageConfig.key}-upload`} style={{ cursor: 'pointer', margin: 0 }}>
                        Upload Image
                      </label>
                      <input
                        id={`${imageConfig.key}-upload`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload(imageConfig.key, file)
                        }}
                        style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }}
                      />
                      <button type="button" className="admin-action-btn" onClick={() => handleImageDelete(imageConfig.key)}>
                        Delete Image
                      </button>
                    </div>

                    {activeUrl && (
                      <img
                        src={activeUrl}
                        alt={imageConfig.label}
                        style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.2)', marginBottom: '10px' }}
                      />
                    )}

                    <div style={{ color: '#cbd5e1', fontSize: '12px', lineHeight: 1.6 }}>
                      <div><b>Status:</b> {currentImage?.fileName ? currentImage.fileName : 'No image assigned'}</div>
                      <div><b>Updated:</b> {currentImage?.updatedDate ? new Date(currentImage.updatedDate).toLocaleString() : 'Not uploaded yet'}</div>
                      <div><b>Key:</b> {imageConfig.key}</div>
                      <div><b>Recommended:</b> {imageConfig.recommended}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

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
