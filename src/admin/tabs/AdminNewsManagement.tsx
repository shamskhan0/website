import { useState } from 'react'
import type { FeatureItem, NewsItem } from '../../types'

export function AdminNewsManagement({
  featuresList,
  setFeaturesList,
  newsList,
  setNewsList,
  showToast,
}: {
  featuresList: FeatureItem[]
  setFeaturesList: (items: FeatureItem[]) => void
  newsList: NewsItem[]
  setNewsList: (items: NewsItem[]) => void
  showToast: (msg: string) => void
}) {
  const [featureTitle, setFeatureTitle] = useState('')
  const [featureText, setFeatureText] = useState('')
  const [featureIcon, setFeatureIcon] = useState('✦')
  const [featureImage, setFeatureImage] = useState('/features/fast-reliable.jpg')
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [tag, setTag] = useState('PRODUCT UPDATE')
  const [color, setColor] = useState('violet')
  const [text, setText] = useState('')
  const [date, setDate] = useState('27 AUG 2026')
  const [isFeatured, setIsFeatured] = useState(false)
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'
  )
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null)

  const PRESET_IMAGES = [
    { label: 'Cyber Tech', url: '/news/app-release-v2.jpg' },
    { label: 'Financial AI', url: '/news/digital-journey.jpg' },
    { label: 'Security Vault', url: '/news/cyber-trust.jpg' },
    { label: 'AI Wealth Hero', url: '/news/featured-ai-wealth.jpg' },
  ]

  const resetFeatureForm = () => {
    setEditingFeatureId(null)
    setFeatureTitle('')
    setFeatureText('')
    setFeatureIcon('✦')
    setFeatureImage('/features/fast-reliable.jpg')
  }

  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault()

    const nextItem: FeatureItem = {
      id: editingFeatureId || `feature-${Date.now()}`,
      title: featureTitle.trim(),
      text: featureText.trim(),
      icon: featureIcon || '✦',
      image: featureImage.trim() || '/features/fast-reliable.jpg',
    }

    if (!nextItem.title || !nextItem.text) return

    const updated = editingFeatureId
      ? featuresList.map((item) => item.id === editingFeatureId ? nextItem : item)
      : [nextItem, ...featuresList]

    setFeaturesList(updated)
    resetFeatureForm()
    showToast(editingFeatureId ? 'Feature card updated and live on website!' : 'Feature card added and live on website!')
  }

  const startEditingFeature = (item: FeatureItem) => {
    setEditingFeatureId(item.id)
    setFeatureTitle(item.title)
    setFeatureText(item.text)
    setFeatureIcon(item.icon || '✦')
    setFeatureImage(item.image || '/features/fast-reliable.jpg')
  }

  const handleDeleteFeature = (id: string) => {
    if (confirm('Delete this feature card from the public section?')) {
      setFeaturesList(featuresList.filter((item) => item.id !== id))
      if (editingFeatureId === id) resetFeatureForm()
      showToast('Feature card removed from public website.')
    }
  }

  const handleFeatureImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      setFeatureImage(result)
      showToast('Feature image uploaded successfully.')
    }
    reader.readAsDataURL(file)
  }

  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault()

    const nextItem: NewsItem = {
      id: editingNewsId || `news-${Date.now()}`,
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
    if (editingNewsId) {
      updatedList = newsList.map((n) => n.id === editingNewsId ? { ...n, ...nextItem } : n)
    } else {
      if (isFeatured) {
        updatedList = updatedList.map((n) => ({ ...n, featured: false }))
      }
      updatedList = [nextItem, ...updatedList]
    }

    setNewsList(updatedList)
    setTitle('')
    setText('')
    setDate('27 AUG 2026')
    setIsFeatured(false)
    setEditingNewsId(null)
    showToast(editingNewsId ? 'News card updated and live on website!' : 'New article published and live on website!')
  }

  const startEditingNews = (item: NewsItem) => {
    setEditingNewsId(item.id)
    setTitle(item.title)
    setTag(item.tag || 'PRODUCT UPDATE')
    setColor(item.color || 'violet')
    setText(item.text)
    setDate(item.date || '27 AUG 2026')
    setImageUrl(item.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop')
    setIsFeatured(Boolean(item.featured))
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
      if (editingNewsId === id) {
        setEditingNewsId(null)
        setTitle('')
        setText('')
        setDate('27 AUG 2026')
        setImageUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop')
        setIsFeatured(false)
      }
      showToast('Article removed from public feed.')
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file.')
      return
    }

    setImageUrl(file.name)

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      setImageUrl(result)
      showToast('Image uploaded successfully.')
    }
    reader.readAsDataURL(file)
  }

  const resetNewsForm = () => {
    setEditingNewsId(null)
    setTitle('')
    setTag('PRODUCT UPDATE')
    setColor('violet')
    setText('')
    setDate('27 AUG 2026')
    setImageUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop')
    setIsFeatured(false)
  }

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>{editingFeatureId ? 'Edit Feature Card' : 'Create Feature Card'}</h3>
            <p>Update the title, description, icon and image used in the public feature section.</p>
          </div>
        </div>

        <form onSubmit={handleAddFeature}>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label>Feature Title</label>
              <input
                type="text"
                className="admin-input"
                value={featureTitle}
                onChange={(e) => setFeatureTitle(e.target.value)}
                placeholder="Fast & reliable"
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Icon</label>
              <input
                type="text"
                className="admin-input"
                value={featureIcon}
                onChange={(e) => setFeatureIcon(e.target.value)}
                placeholder="✦"
                maxLength={2}
              />
            </div>
            <div className="admin-form-group full-width">
              <label>Feature Image</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label className="admin-action-btn" htmlFor="feature-image-upload" style={{ cursor: 'pointer', margin: 0, width: 'fit-content' }}>
                  Upload Picture
                </label>
                <input
                  id="feature-image-upload"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFeatureImageUpload}
                  aria-label="Upload feature image"
                  style={{
                    position: 'absolute',
                    width: '1px',
                    height: '1px',
                    padding: 0,
                    margin: '-1px',
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    whiteSpace: 'nowrap',
                    border: 0,
                    opacity: 0,
                  }}
                />
                {featureImage && (
                  <img
                    src={featureImage}
                    alt="Feature preview"
                    style={{
                      width: '100%',
                      maxHeight: '180px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      background: '#0b1220',
                    }}
                  />
                )}
              </div>
            </div>
            <div className="admin-form-group full-width">
              <label>Feature Description</label>
              <textarea
                className="admin-textarea"
                value={featureText}
                onChange={(e) => setFeatureText(e.target.value)}
                placeholder="Write a clear short description for this card..."
                required
              />
            </div>
          </div>
          <div style={{ marginTop: '18px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button type="submit" className="button button-primary">
              {editingFeatureId ? 'Update Feature Card' : 'Add Feature Card'} <span>→</span>
            </button>
            {editingFeatureId && (
              <button type="button" className="admin-action-btn" onClick={resetFeatureForm}>
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>Published Feature Cards ({featuresList.length})</h3>
            <p>Manage the images, titles and descriptions shown in the features section.</p>
          </div>
        </div>

        <div className="admin-news-grid">
          {featuresList.map((item) => (
            <div className="admin-news-card" key={item.id}>
              {item.image && (
                <img src={item.image} alt={item.title} className="admin-news-thumb" />
              )}
              <div className="admin-news-info" style={{ flex: 1 }}>
                <div className="admin-news-meta">
                  <span className="admin-badge live">{item.icon || '✦'}</span>
                </div>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button className="admin-action-btn" onClick={() => startEditingFeature(item)}>
                  Edit
                </button>
                <button className="admin-action-btn danger" onClick={() => handleDeleteFeature(item.id)}>
                  Delete ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>{editingNewsId ? 'Edit Story' : 'Publish Official News & Story'}</h3>
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
              <label>Cover Picture</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="admin-action-btn" htmlFor="news-cover-upload" style={{ cursor: 'pointer', margin: 0, width: 'fit-content' }}>
                    Upload Image
                  </label>
                  <input
                    id="news-cover-upload"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      background: 'rgba(15, 23, 42, 0.8)',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </div>

                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Selected cover preview"
                    style={{
                      width: '100%',
                      maxHeight: '170px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      background: '#0b1220',
                    }}
                  />
                )}

              </div>
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
          <div style={{ marginTop: '18px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button type="submit" className="button button-primary">
              {editingNewsId ? 'Update Story' : 'Publish Story with Picture'} <span>→</span>
            </button>
            {editingNewsId && (
              <button type="button" className="admin-action-btn" onClick={resetNewsForm}>
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </div>

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
                <img src={item.imageUrl} alt={item.title} className="admin-news-thumb" />
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
                <button className="admin-action-btn" onClick={() => startEditingNews(item)}>
                  Edit
                </button>
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
