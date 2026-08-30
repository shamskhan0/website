import { useState } from 'react'
import type { NewsItem } from '../../types'

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
