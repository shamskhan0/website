import AdBanner from '../AdBanner'
import type { NewsItem, SiteSettings } from '../types'

const AD_SLOT_NEWS = '1647148763'

export function NewsSection({
  newsList,
  onSelectArticle,
}: {
  newsList: NewsItem[]
  onSelectArticle: (article: NewsItem) => void
}) {
  const featuredArticle = newsList.find((n) => n.featured) || newsList[0]
  const gridArticles = newsList.filter((n) => n.id !== featuredArticle?.id)

  return (
    <>
      <section className="section news-section" id="news">
        <div className="section-heading news-heading">
          <p className="eyebrow">FROM ROSHAN DIGITAL <span></span></p>
          <h2>Good things,<br /><em>worth knowing.</em></h2>
          <a className="text-link" href="#news">View all stories <span>→</span></a>
        </div>

        {/* Featured Article Card */}
        {featuredArticle && (
          <article className="featured-article-card">
            <div className="featured-visual">
              {featuredArticle.imageUrl && (
                <img
                  src={featuredArticle.imageUrl}
                  alt={featuredArticle.title}
                  className="featured-img"
                  loading="lazy"
                />
              )}
              <div className="featured-overlay"></div>
              <div className="featured-badge-bar">
                <span className="featured-badge">★ FEATURED STORY</span>
                <span className="featured-read-time">{featuredArticle.readTime || '4 MIN READ'}</span>
              </div>
            </div>
            <div className="featured-content">
              <div className="featured-meta">
                <time>{featuredArticle.date}</time>
                <span>•</span>
                <span>By {featuredArticle.author || 'Roshan Digital Intelligence'}</span>
              </div>
              <h3 className="featured-title">{featuredArticle.title}</h3>
              <p className="featured-text">{featuredArticle.text}</p>
              <div className="featured-stats">
                {(featuredArticle.highlights || ['+18.4% Monthly Alpha', '256-bit AES Cryptography', 'Zero-Knowledge Privacy']).map((stat, i) => (
                  <span key={i} className="featured-stat-pill">✦ {stat}</span>
                ))}
              </div>
              <div className="featured-actions">
                <button
                  className="button button-primary"
                  onClick={() => onSelectArticle(featuredArticle)}
                >
                  {featuredArticle.ctaText || 'Read Full Article ↗'}
                </button>
              </div>
            </div>
          </article>
        )}

        {/* Regular News Grid */}
        <div className="news-grid">
          {gridArticles.map((item) => (
            <article className="news-card" key={item.id}>
              <div className={`news-image ${item.color}`}>
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.title} className="news-img-cover" loading="lazy" />
                )}
                <div className="news-image-overlay"></div>
                <span>{item.tag}</span>
              </div>
              <div className="news-content">
                <time>{item.date}</time>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <a
                  href="#news"
                  onClick={(e) => {
                    e.preventDefault()
                    onSelectArticle(item)
                  }}
                >
                  Read story <span>→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Ad Banner 2 — Between News & Contact Section ── */}
      <AdBanner adSlot={AD_SLOT_NEWS} adFormat="auto" style={{ margin: '0 auto', maxWidth: '970px', padding: '10px 20px' }} />
    </>
  )
}

export function ContactSection({ siteSettings }: { siteSettings: SiteSettings }) {
  return (
    <section className="contact-section" id="contact">
      <div>
        <p className="eyebrow">WE'RE HERE TO HELP <span></span></p>
        <h2>Have a question?<br /><em>Let's talk.</em></h2>
      </div>
      <a className="button button-primary" href={`mailto:${siteSettings.supportEmail}`}>
        Get in touch <span>↗</span>
      </a>
    </section>
  )
}
