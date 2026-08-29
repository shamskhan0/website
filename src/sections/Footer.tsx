import AdBanner from '../AdBanner'
import type { SiteSettings } from '../types'

const AD_SLOT_FOOTER = '1647148764'

export function SiteFooter({
  onOpenAbout,
  onOpenHelp,
  onOpenAdmin,
}: {
  onOpenAbout: () => void
  onOpenHelp: () => void
  onOpenAdmin: () => void
}) {
  return (
    <>
      {/* ── Ad Banner 3 — Above Footer ── */}
      <AdBanner adSlot={AD_SLOT_FOOTER} adFormat="horizontal" style={{ margin: '0 auto', maxWidth: '970px', padding: '10px 20px' }} />

      <footer>
        <div className="footer-main">
          <div>
            <a className="brand" href="#top" aria-label="Roshan Digital">
              <img src="/roshan-digital-logo-transparent.png" alt="Roshan Digital" className="footer-logo-img" />
            </a>
            <p>Secure Investments. Daily Profits.<br />Smarter Decisions with AI.</p>
          </div>
          <div className="footer-links">
            <div>
              <b>Explore</b>
              <a href="#app">The app</a>
              <a href="#news">News & stories</a>
              <a href="#about" onClick={(e) => { e.preventDefault(); onOpenAbout() }}>About us</a>
            </div>
            <div>
              <b>Support</b>
              <a href="#help" onClick={(e) => { e.preventDefault(); onOpenHelp() }}>Help centre</a>
              <a href="#contact">Contact us</a>
              <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy policy ↗</a>
              <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of service ↗</a>
              <a href="/#data-safety">Data safety</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Roshan Digital. All rights reserved.</span>
          <button onClick={onOpenAdmin}>Thanks you ↗</button>
          <span>Made for better days.</span>
        </div>
      </footer>
    </>
  )
}

export function TrustStrip() {
  return (
    <section className="trust-strip">
      <span>Built for the way you live digitally</span>
      <div><b>01</b><i></i><b>02</b><i></i><b>03</b><i></i><b>04</b></div>
    </section>
  )
}

export type { SiteSettings }
