import { useMemo, useState } from 'react'
import type { ManagedImage, SiteSettings } from '../../types'
import { deleteImageByUrl, uploadImage } from '../../supabase'

const MEDIA_LIBRARY_DEFS = [
  {
    key: 'hero_mobile_image',
    label: 'Hero Mobile Image',
    category: 'Hero',
    fallback: '/app-screenshot.jpg',
    usage: ['Home Hero', 'App Showcase', 'Download CTA'],
  },
  {
    key: 'hero_background',
    label: 'Hero Background',
    category: 'Backgrounds',
    fallback: '/features/fast-reliable.jpg',
    usage: ['Hero Atmosphere', 'Background Layer'],
  },
  {
    key: 'app_logo',
    label: 'App Logo',
    category: 'Logo',
    fallback: '/roshan-digital-logo-transparent.png',
    usage: ['Header', 'Footer', 'Admin Branding'],
  },
  {
    key: 'footer_logo',
    label: 'Footer Logo',
    category: 'Footer',
    fallback: '/roshan-digital-logo-transparent.png',
    usage: ['Footer Branding'],
  },
  {
    key: 'app_screenshot',
    label: 'App Screenshot',
    category: 'Mobile Mockup',
    fallback: '/app-screenshot.jpg',
    usage: ['App Showcase', 'Final CTA'],
  },
  {
    key: 'feature_image_1',
    label: 'Feature Card 1',
    category: 'Features',
    fallback: '/features/fast-reliable.jpg',
    usage: ['Feature Showcase'],
  },
  {
    key: 'feature_image_2',
    label: 'Feature Card 2',
    category: 'Features',
    fallback: '/features/secure-by-design.jpg',
    usage: ['Feature Showcase'],
  },
  {
    key: 'feature_image_3',
    label: 'Feature Card 3',
    category: 'Features',
    fallback: '/features/easy-to-use.jpg',
    usage: ['Feature Showcase'],
  },
  {
    key: 'feature_image_4',
    label: 'Feature Card 4',
    category: 'Features',
    fallback: '/features/always-improving.jpg',
    usage: ['Feature Showcase'],
  },
  {
    key: 'hero_badge_art',
    label: 'Hero Accent Graphic',
    category: 'Promotional',
    fallback: '/features/fast-reliable.jpg',
    usage: ['Decorative Hero Accent'],
  },
  {
    key: 'news_featured',
    label: 'News Featured Image',
    category: 'News',
    fallback: '/news/featured-ai-wealth.jpg',
    usage: ['News Feature'],
  },
  {
    key: 'security_visual',
    label: 'Security Visual',
    category: 'Security',
    fallback: '/features/secure-by-design.jpg',
    usage: ['Security Section'],
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

const categoryOptions = [
  'All',
  'Hero',
  'Logo',
  'Mobile Mockup',
  'App Screenshots',
  'Features',
  'Backgrounds',
  'News',
  'Security',
  'Footer',
  'Promotional',
  'Other',
]

export function MediaLibrary({ settings, onSave, onPublishAll }: { settings: SiteSettings; onSave: (newSettings: SiteSettings) => void; onPublishAll?: (newSettings: SiteSettings) => Promise<string> }) {
  const [formData, setFormData] = useState<SiteSettings>(settings)
  const [statusMessage, setStatusMessage] = useState('')
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [sortMode, setSortMode] = useState<'date' | 'name'>('date')

  const entries = useMemo(
    () => MEDIA_LIBRARY_DEFS.map((item) => {
      const current = formData.images?.[item.key]
      const src = current?.url || item.fallback
      return {
        ...item,
        current,
        url: src,
      }
    }),
    [formData.images],
  )

  const filteredEntries = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const visible = entries.filter((entry) => {
      const matchesCategory = categoryFilter === 'All' || entry.category === categoryFilter
      const searchable = `${entry.label} ${entry.key} ${entry.usage.join(' ')}`.toLowerCase()
      const matchesQuery = !normalized || searchable.includes(normalized)
      return matchesCategory && matchesQuery
    })

    return visible.sort((a, b) => {
      if (sortMode === 'name') {
        return a.label.localeCompare(b.label)
      }
      return new Date(b.current?.updatedDate || b.current?.uploadDate || '2000-01-01').getTime() -
        new Date(a.current?.updatedDate || a.current?.uploadDate || '2000-01-01').getTime()
    })
  }, [categoryFilter, entries, query, sortMode])

  const handleImageUpload = async (key: string, file: File) => {
    setStatusMessage('Uploading image…')
    const result = await uploadImage(file, 'media-library')
    if ('error' in result) {
      setStatusMessage(`Upload failed: ${result.error}`)
      return
    }

    const current = formData.images?.[key]
    const oldUrl = current?.url || ''
    const nextImage: ManagedImage = {
      ...(current ?? createManagedImage(key, '', file.name)),
      key,
      url: result.url,
      fileName: file.name,
      uploadDate: current?.uploadDate ?? new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      active: true,
      version: (current?.version ?? 0) + 1,
    }

    const nextFormData: SiteSettings = {
      ...formData,
      images: {
        ...(formData.images ?? {}),
        [key]: nextImage,
      },
    }
    setFormData(nextFormData)

    // AUTO-PUBLISH: upload hote hi image seedha live website par.
    if (onPublishAll) {
      setStatusMessage('Image uploaded — publishing to live website…')
      const msg = await onPublishAll(nextFormData)
      if (oldUrl && oldUrl !== result.url) {
        await deleteImageByUrl(oldUrl)
      }
      setStatusMessage(msg)
      return
    }

    setFormData((prev) => ({
      ...prev,
      images: {
        ...(prev.images ?? {}),
        [key]: nextImage,
      },
    }))

    setStatusMessage(`${key.replace(/_/g, ' ')} uploaded to Supabase Storage. Press "Save Media Library" to publish it on the live site.`)

    // Safe replace: new URL saved first, old storage file removed after.
    if (oldUrl && oldUrl !== result.url) {
      await deleteImageByUrl(oldUrl)
    }
  }

  const handleImageDelete = async (key: string) => {
    const current = formData.images?.[key]
    const removedUrl = current?.url || ''
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
    setStatusMessage(`${key.replace(/_/g, ' ')} removed. Press "Save Media Library" to publish the change, then the storage file is deleted.`)

    if (removedUrl) {
      await deleteImageByUrl(removedUrl)
    }
  }

  const handleSave = () => {
    onSave(formData)
    setStatusMessage('Media library saved and synced to the live website.')
  }

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setStatusMessage('Image URL copied to clipboard.')
    } catch {
      setStatusMessage('Clipboard access is unavailable in this browser.')
    }
  }

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div>
          <h3>Media Library</h3>
          <p>Manage all important website images from a single source of truth.</p>
        </div>
      </div>

      {statusMessage && (
        <div className="admin-toast" style={{ marginBottom: '16px' }}>
          <span>✓</span> {statusMessage}
        </div>
      )}

      <div className="media-library-toolbar" style={{ display: 'flex', gap: '12px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <input
          type="text"
          className="admin-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search image name or key"
          style={{ maxWidth: '300px' }}
        />
        <select className="admin-input" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ maxWidth: '220px' }}>
          {categoryOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <select className="admin-input" value={sortMode} onChange={(e) => setSortMode(e.target.value as 'date' | 'name')} style={{ maxWidth: '180px' }}>
          <option value="date">Sort by date</option>
          <option value="name">Sort by name</option>
        </select>
      </div>

      <div className="media-library-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        {filteredEntries.map((entry) => {
          const isActive = Boolean(entry.current?.active && entry.current?.url)
          return (
            <div key={entry.key} className="media-card" style={{ background: 'rgba(10,16,20,0.68)', border: '1px solid var(--line)', borderRadius: '18px', overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: '170px', overflow: 'hidden', borderBottom: '1px solid rgba(148,163,184,0.12)' }}>
                <img
                  src={entry.url}
                  alt={entry.label}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <span style={{ position: 'absolute', left: '10px', top: '10px', borderRadius: '999px', padding: '5px 8px', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', background: isActive ? 'rgba(16,185,129,0.18)' : 'rgba(148,163,184,0.12)', color: isActive ? '#9ae6b4' : '#cbd5e1' }}>
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '17px', lineHeight: 1.3 }}>{entry.label}</h4>
                </div>

                <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.7 }}>
                  <div><b style={{ color: '#dbeafe' }}>Category:</b> {entry.category}</div>
                  <div><b style={{ color: '#dbeafe' }}>Key:</b> {entry.key}</div>
                  <div><b style={{ color: '#dbeafe' }}>Used In:</b> {entry.usage.join(', ')}</div>
                  <div><b style={{ color: '#dbeafe' }}>File:</b> {entry.current?.fileName || 'Not uploaded'}</div>
                  <div><b style={{ color: '#dbeafe' }}>Updated:</b> {entry.current?.updatedDate ? new Date(entry.current.updatedDate).toLocaleDateString() : 'Not set'}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
                  <label className="admin-action-btn" htmlFor={`${entry.key}-media-upload`} style={{ cursor: 'pointer', margin: 0 }}>
                    Upload
                  </label>
                  <input
                    id={`${entry.key}-media-upload`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(entry.key, file)
                    }}
                    style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }}
                  />
                  <button type="button" className="admin-action-btn" onClick={() => copyUrl(entry.url)}>
                    Copy URL
                  </button>
                  <button type="button" className="admin-action-btn" onClick={() => handleImageDelete(entry.key)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '24px' }}>
        <button type="button" className="button button-primary" onClick={handleSave}>Save Media Library <span>✓</span></button>
      </div>
    </div>
  )
}
