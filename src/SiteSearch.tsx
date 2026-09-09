import { useMemo, useState, useRef, useEffect } from 'react'
import type { FeatureItem, NewsItem, ApkVersion } from './types'

/**
 * Website-wide search across ALL public content:
 * news, features, APK/versions, screenshots, FAQ & static sections.
 * Pure client-side, case-insensitive, instant (no network), works on
 * mobile + desktop. Scrolls to and highlights the first match.
 */

export interface SearchHit {
  id: string
  section: string
  sectionId: string
  title: string
  snippet: string
  action?: () => void
}

interface SearchIndexProps {
  newsList: NewsItem[]
  featuresList: FeatureItem[]
  apkVersions: ApkVersion[]
  onClose: () => void
  onSelectArticle: (article: NewsItem) => void
}

/** Strip accents + lowercase for forgiving matching. */
const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')

function buildIndex(
  newsList: NewsItem[],
  featuresList: FeatureItem[],
  apkVersions: ApkVersion[],
  onSelectArticle: (a: NewsItem) => void,
): SearchHit[] {
  const hits: SearchHit[] = []

  for (const n of newsList) {
    hits.push({
      id: `news-${n.id}`,
      section: 'News & Stories',
      sectionId: 'news',
      title: n.title,
      snippet: `${n.tag} · ${n.date} · ${n.text}`,
      action: () => onSelectArticle(n),
    })
  }

  for (const f of featuresList) {
    hits.push({
      id: `feature-${f.title}`,
      section: 'Features',
      sectionId: 'app',
      title: f.title,
      snippet: f.text,
    })
  }

  for (const v of apkVersions) {
    hits.push({
      id: `apk-${v.id}`,
      section: `App Version v${v.version}`,
      sectionId: 'app',
      title: `Roshan Digital v${v.version} (Build #${v.build}) · ${v.status}`,
      snippet: `Released ${v.releaseDate} · ${v.size} · Android ${v.minAndroid} · ${v.changelog.join('; ')}`,
    })
  }

  // Screenshots section
  hits.push({
    id: 'screenshots',
    section: 'App Screenshots',
    sectionId: 'app',
    title: 'App Screenshots & Interface Preview',
    snippet: 'Dashboard, portfolio, AI insights and secure wallet screens of the Roshan Digital app.',
  })

  // FAQ / help content
  const faqs: Array<[string, string]> = [
    ['Download and install the latest APK', 'Use the Download latest APK button in the App section. Android 8.0+ users can install the APK directly after download.'],
    ['AI-assisted investing', 'Smart algorithms analyze real-time market movements, risk profiles and automated rebalancing indicators.'],
    ['Funds and account security', 'Multi-factor authentication, cold-storage security protocols and 256-bit SSL encryption protect all accounts.'],
    ['24/7 official support', 'Email support@roshandigital.com or connect via the official live support channels.'],
    ['Privacy and data protection', 'AES-256 and TLS 1.3 encryption, zero-knowledge credential architecture, GDPR/CCPA data rights.'],
    ['Referral program', 'Invite friends to Roshan Digital and earn rewards when they join and invest.'],
  ]
  for (const [q, a] of faqs) {
    hits.push({
      id: `faq-${q}`,
      section: 'Help & FAQ',
      sectionId: 'app',
      title: q,
      snippet: a,
    })
  }

  // Static sections
  const sections: Array<[string, string, string, string]> = [
    ['Home & Hero', 'top', 'Digital, made human — the next generation of digital finance', 'Roshan Digital is your trusted AI-powered platform for secure investments, daily profits and convenient digital services.'],
    ['How It Works', 'app', 'Download the app, create your account, start using Roshan Digital', 'Three simple steps built for clarity: download, register, and use the clean dashboard.'],
    ['Why Roshan Digital', 'app', 'Simple experience, modern interface, easy access, transparent information', 'Designed to keep your digital life simple and confident.'],
    ['App Release', 'app', 'Meet the new Roshan Digital — latest release & download', 'More clarity, more control. Download the latest APK for Android.'],
    ['App Screenshots', 'app', 'Screenshots of the Roshan Digital mobile app', 'Dashboard, investments and security features preview.'],
    ['Security', 'app', 'Bank-grade security, encryption and zero-knowledge architecture', 'Your funds and data are protected with 256-bit AES and TLS 1.3.'],
    ['Contact', 'contact', "Have a question? Let's talk", 'Get in touch with the Roshan Digital support team by email.'],
    ['Download Page', 'app', 'Get the Roshan Digital app — direct APK download', 'Installation guide, version information and download help for Android.'],
  ]
  for (const [title, sectionId, t, snippet] of sections) {
    hits.push({ id: `sec-${title}`, section: title, sectionId, title: t, snippet })
  }

  return hits
}

export function SiteSearch({ newsList, featuresList, apkVersions, onClose, onSelectArticle }: SearchIndexProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const index = useMemo(
    () => buildIndex(newsList, featuresList, apkVersions, onSelectArticle),
    [newsList, featuresList, apkVersions, onSelectArticle],
  )

  const results = useMemo(() => {
    const q = norm(query.trim())
    if (q.length < 2) return []
    const terms = q.split(/\s+/)
    return index
      .map((hit) => {
        const hay = norm(`${hit.title} ${hit.snippet} ${hit.section}`)
        let score = 0
        for (const t of terms) {
          if (!hay.includes(t)) return null
          if (norm(hit.title).includes(t)) score += 2
          if (norm(hit.section).includes(t)) score += 1
          score += 1
        }
        return { hit, score }
      })
      .filter((r): r is { hit: SearchHit; score: number } => r !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((r) => r.hit)
  }, [query, index])

  const go = (hit: SearchHit) => {
    onClose()
    hit.action?.()
    const el = document.getElementById(hit.sectionId)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="search-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Website search">
      <div className="search-window" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-row">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            ref={inputRef}
            className="search-input"
            type="search"
            placeholder="Search news, features, versions, help…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search the website"
          />
          <button className="modal-close search-close" onClick={onClose} aria-label="Close search">×</button>
        </div>

        <div className="search-results">
          {query.trim().length < 2 ? (
            <p className="search-hint">Type at least 2 characters — search covers news, features, app versions, screenshots, FAQ and every section.</p>
          ) : results.length === 0 ? (
            <div className="search-empty">
              <b>No results for “{query}”</b>
              <p>Try different keywords — e.g. “APK”, “security”, “profit”, “version”, “install”.</p>
            </div>
          ) : (
            results.map((hit) => (
              <button className="search-hit" key={hit.id} onClick={() => go(hit)}>
                <span className="search-hit-section">{hit.section}</span>
                <b className="search-hit-title">{hit.title}</b>
                <span className="search-hit-snippet">{hit.snippet.length > 140 ? `${hit.snippet.slice(0, 140)}…` : hit.snippet}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
