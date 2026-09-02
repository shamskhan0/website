export function CookiePolicyModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="modal-title-lockup">
            <img src="/roshan-digital-logo-transparent.png" alt="Roshan Digital" />
            <div>
              <h2>Cookie Policy</h2>
              <p>How We Use Cookies and Tracking Technologies</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        </header>
        <div className="modal-body">
          <p><strong>Effective Date:</strong> August 27, 2026</p>

          <h3>1. What Are Cookies?</h3>
          <p>
            Cookies are small text files that are stored on your device (computer, tablet, or mobile
            phone) when you visit a website. They help websites recognize your device and remember
            information about your visit, such as your preferences and login status.
          </p>

          <h3>2. How We Use Cookies</h3>
          <p>
            Roshan Digital uses cookies and similar technologies for the following purposes:
          </p>

          <h4>Essential Cookies</h4>
          <ul>
            <li><strong>Session Management:</strong> To keep you logged in and maintain your session</li>
            <li><strong>Security:</strong> To detect and prevent fraudulent activity</li>
            <li><strong>Functionality:</strong> To remember your preferences and settings</li>
            <li><strong>Performance:</strong> To track site performance and usage</li>
          </ul>

          <h4>Analytics Cookies</h4>
          <ul>
            <li><strong>Google Analytics:</strong> To understand how visitors use our website</li>
            <li><strong>User Behavior:</strong> To track page views, session duration, and user flows</li>
            <li><strong>Conversion Tracking:</strong> To measure app downloads and key actions</li>
            <li><strong>Improvement:</strong> To identify areas for website improvement</li>
          </ul>

          <h4>Advertising Cookies</h4>
          <ul>
            <li><strong>Google AdSense:</strong> To deliver relevant advertisements based on your interests</li>
            <li><strong>Remarketing:</strong> To show targeted ads on other websites you visit</li>
            <li><strong>Ad Performance:</strong> To measure the effectiveness of advertising campaigns</li>
          </ul>

          <h4>Third-Party Cookies</h4>
          <ul>
            <li><strong>Google Services:</strong> Google Analytics, Google AdSense, Google Ad Manager</li>
            <li><strong>Social Media:</strong> Social sharing buttons may set cookies</li>
            <li><strong>Content Delivery:</strong> CDN and other third-party services</li>
          </ul>

          <h3>3. Types of Cookies We Use</h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.3)' }}>
                <th style={{ textAlign: 'left', padding: '8px 0', color: '#10b981' }}>Type</th>
                <th style={{ textAlign: 'left', padding: '8px 0', color: '#10b981' }}>Duration</th>
                <th style={{ textAlign: 'left', padding: '8px 0', color: '#10b981' }}>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.15)' }}>
                <td style={{ padding: '10px 0' }}>Session Cookies</td>
                <td style={{ padding: '10px 0' }}>During your visit</td>
                <td style={{ padding: '10px 0' }}>Essential for site functionality</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.15)' }}>
                <td style={{ padding: '10px 0' }}>Persistent Cookies</td>
                <td style={{ padding: '10px 0' }}>Up to 2 years</td>
                <td style={{ padding: '10px 0' }}>Remember preferences and login</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.15)' }}>
                <td style={{ padding: '10px 0' }}>Analytics Cookies</td>
                <td style={{ padding: '10px 0' }}>Up to 2 years</td>
                <td style={{ padding: '10px 0' }}>Track usage patterns</td>
              </tr>
              <tr>
                <td style={{ padding: '10px 0' }}>Advertising Cookies</td>
                <td style={{ padding: '10px 0' }}>Varies</td>
                <td style={{ padding: '10px 0' }}>Deliver personalized ads</td>
              </tr>
            </tbody>
          </table>

          <h3>4. Google Analytics</h3>
          <p>
            We use Google Analytics to understand how visitors interact with our website. Google
            Analytics collects information such as:
          </p>
          <ul>
            <li>Your IP address (anonymized)</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Pages visited and time spent</li>
            <li>Traffic source and clickpaths</li>
          </ul>
          <p>
            This data is anonymized and used only to improve our website. You can opt out of Google
            Analytics by installing the{' '}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--emerald)' }}
            >
              Google Analytics Opt-out Browser Add-on
            </a>
            .
          </p>

          <h3>5. Google AdSense</h3>
          <p>
            Roshan Digital uses Google AdSense to serve advertisements. Google may use cookies to
            serve ads based on your prior visits to our website and other sites on the internet.
          </p>
          <p>
            You can control your ad preferences and opt out of personalized advertising by visiting{' '}
            <a
              href="https://myaccount.google.com/ads"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--emerald)' }}
            >
              Google Ad Settings
            </a>
            .
          </p>

          <h3>6. Third-Party Cookies</h3>
          <p>
            Third-party service providers (Google, analytics platforms, advertising networks) may set
            their own cookies on your device. These are governed by their respective privacy policies,
            not by Roshan Digital.
          </p>
          <p>
            Common third-party providers:
          </p>
          <ul>
            <li>
              <strong>Google:</strong>{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--emerald)' }}
              >
                Google Privacy Policy
              </a>
            </li>
            <li>
              <strong>Google AdSense:</strong>{' '}
              <a
                href="https://support.google.com/adsense"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--emerald)' }}
              >
                AdSense Help Center
              </a>
            </li>
          </ul>

          <h3>7. How to Control Cookies</h3>
          <p>
            You can control and manage cookies in several ways:
          </p>

          <h4>Browser Settings</h4>
          <ul>
            <li><strong>Chrome:</strong> Settings → Privacy → Cookies and other site data</li>
            <li><strong>Firefox:</strong> Preferences → Privacy & Security → Cookies and Site Data</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Cookies and Website Data</li>
            <li><strong>Edge:</strong> Settings → Privacy → Cookies and other site permissions</li>
          </ul>

          <p>
            <strong>Note:</strong> Disabling cookies may affect the functionality of our website and
            your ability to access certain features.
          </p>

          <h4>Third-Party Opt-Out</h4>
          <ul>
            <li>
              <a
                href="https://myaccount.google.com/ads"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--emerald)' }}
              >
                Opt out of Google personalized ads
              </a>
            </li>
            <li>
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--emerald)' }}
              >
                Install Google Analytics Opt-out Add-on
              </a>
            </li>
            <li>
              <a
                href="http://optout.aboutads.info"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--emerald)' }}
              >
                Digital Advertising Alliance Opt-out
              </a>
            </li>
          </ul>

          <h3>8. Do Not Track</h3>
          <p>
            Some browsers include a "Do Not Track" (DNT) feature. When enabled, your browser sends a
            signal to websites requesting that tracking be disabled. However, Roshan Digital and many
            websites do not respond to DNT signals at this time.
          </p>

          <h3>9. Policy Updates</h3>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in our practices or
            applicable laws. We will notify you of significant changes by updating the "Effective Date"
            above.
          </p>

          <h3>10. Questions About Cookies</h3>
          <p>
            If you have questions about our use of cookies or tracking technologies, please contact us
            at:
          </p>
          <ul>
            <li>
              <strong>Email:</strong>{' '}
              <a href="mailto:privacy@roshandigital.com" style={{ color: 'var(--emerald)' }}>
                privacy@roshandigital.com
              </a>
            </li>
            <li>
              <strong>Support:</strong>{' '}
              <a href="mailto:support@roshandigital.com" style={{ color: 'var(--emerald)' }}>
                support@roshandigital.com
              </a>
            </li>
          </ul>

          <div style={{ marginTop: '28px', padding: '16px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px' }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
              <strong style={{ color: '#10b981' }}>CONTINUED USE</strong> of our website indicates your
              acceptance of our Cookie Policy. You can withdraw consent anytime by adjusting your browser
              settings.
            </p>
          </div>
        </div>
        <footer className="modal-footer">
          <button className="button button-primary" onClick={onClose}>I Understand</button>
        </footer>
      </div>
    </div>
  )
}
