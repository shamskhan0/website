import type { SiteSettings } from '../types'

export function ErrorPage({
  code = '404',
  title = 'Page Not Found',
  message = 'The page you are looking for does not exist or has been moved.',
  siteSettings,
  onNavigateHome,
}: {
  code?: string
  title?: string
  message?: string
  siteSettings: SiteSettings
  onNavigateHome: () => void
}) {
  return (
    <div className="error-page-shell">
      <div className="error-container">
        {/* Decorative background elements */}
        <div className="error-bg-element error-orb-1"></div>
        <div className="error-bg-element error-orb-2"></div>
        <div className="error-bg-element error-line"></div>

        {/* Error content */}
        <div className="error-content">
          <div className="error-code">{code}</div>
          <h1 className="error-title">{title}</h1>
          <p className="error-message">{message}</p>

          {/* Action buttons */}
          <div className="error-actions">
            <button
              className="button button-primary"
              onClick={onNavigateHome}
              style={{ margin: 0 }}
            >
              Back to Home <span>↗</span>
            </button>
            <a
              href={`#app`}
              className="button button-light"
              style={{ margin: 0 }}
            >
              Download App <span>↓</span>
            </a>
          </div>

          {/* Quick links */}
          <div className="error-links">
            <a href="#top" onClick={onNavigateHome}>Home</a>
            <a href="#app">Features</a>
            <a href="#contact">Contact</a>
            <a href={`mailto:${siteSettings.supportEmail}`}>Support</a>
          </div>
        </div>

        {/* Illustration */}
        <div className="error-illustration">
          <div className="error-device">
            <div className="error-device-screen">
              <div className="error-device-content">
                <span className="error-icon">⚠️</span>
              </div>
            </div>
            <div className="error-device-stand"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function NotFoundPage({
  siteSettings,
  onNavigateHome,
}: {
  siteSettings: SiteSettings
  onNavigateHome: () => void
}) {
  return (
    <ErrorPage
      code="404"
      title="Page Not Found"
      message="We couldn't find the page you were looking for. It may have been moved or removed."
      siteSettings={siteSettings}
      onNavigateHome={onNavigateHome}
    />
  )
}

export function ServerErrorPage({
  siteSettings,
  onNavigateHome,
}: {
  siteSettings: SiteSettings
  onNavigateHome: () => void
}) {
  return (
    <ErrorPage
      code="500"
      title="Server Error"
      message="Something went wrong on our end. We're working to fix it. Please try again later."
      siteSettings={siteSettings}
      onNavigateHome={onNavigateHome}
    />
  )
}

export function MaintenancePage({
  siteSettings,
}: {
  siteSettings: SiteSettings
}) {
  return (
    <div className="maintenance-page-shell">
      <div className="maintenance-container">
        <div className="maintenance-bg-element maintenance-orb-1"></div>
        <div className="maintenance-bg-element maintenance-orb-2"></div>

        <div className="maintenance-content">
          <div className="maintenance-icon">🔧</div>
          <h1>We'll Be Right Back</h1>
          <p>We're performing scheduled maintenance to improve your experience.</p>
          <p className="maintenance-eta">Expected to be back online shortly.</p>

          <div className="maintenance-contact">
            <p>Questions? Reach out to us:</p>
            <a href={`mailto:${siteSettings.supportEmail}`} className="button button-primary" style={{ margin: '16px 0 0 0' }}>
              Contact Support <span>→</span>
            </a>
          </div>

          <div className="maintenance-links">
            <a href={`https://t.me/${siteSettings.telegramLink.split('/').pop()}`} target="_blank" rel="noopener noreferrer">
              Telegram Updates
            </a>
          </div>
        </div>

        <div className="maintenance-illustration">
          <div className="maintenance-device">
            <div className="maintenance-device-screen">
              <span>🔧</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
