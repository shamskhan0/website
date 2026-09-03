import type { ApkVersion, SiteSettings } from '../types'

export function DownloadAppPage({
  liveApk,
  siteSettings,
}: {
  liveApk: ApkVersion
  siteSettings: SiteSettings
}) {
  return (
    <div className="download-page">
      <section className="download-hero">
        <div className="download-hero-content">
          <p className="eyebrow">DOWNLOAD & INSTALL <span></span></p>
          <h1>Get the Roshan Digital App</h1>
          <p className="hero-subtitle">
            Secure investments, daily profits, and convenient digital services wherever life takes you.
          </p>
        </div>

        <div className="download-hero-visual">
          <div className="download-phone-frame">
            <div className="download-phone-notch"></div>
            <img
              src={siteSettings.images?.hero_mobile_image?.url || '/app-screenshot.jpg'}
              alt="Roshan Digital app interface"
              className="download-phone-image"
            />
          </div>
        </div>
      </section>

      {/* Platform Options */}
      <section className="section download-platforms">
        <div className="section-heading">
          <p className="eyebrow">CHOOSE YOUR PLATFORM <span></span></p>
          <h2>Available on Android</h2>
          <p>Roshan Digital is optimized for Android devices. Download directly or from Google Play.</p>
        </div>

        <div className="platforms-grid">
          {/* Direct APK Download */}
          <div className="platform-card">
            <div className="platform-icon">📱</div>
            <h3>Direct APK Download</h3>
            <p>Download the APK file directly to your device.</p>
            <div className="download-specs">
              <div><span>Version:</span> <b>{liveApk.version}</b></div>
              <div><span>Size:</span> <b>{liveApk.size}</b></div>
              <div><span>Build:</span> <b>#{liveApk.build}</b></div>
              <div><span>Android:</span> <b>{liveApk.minAndroid}</b></div>
            </div>
            <a
              href={liveApk.downloadUrl}
              download
              className="button button-primary download-btn"
            >
              Download APK <span>↓</span>
            </a>
            <small className="download-note">Direct download to your device</small>
          </div>

          {/* Google Play Store */}
          <div className="platform-card">
            <div className="platform-icon">🎮</div>
            <h3>Google Play Store</h3>
            <p>Install from Google Play for automatic updates and device backup.</p>
            <div className="download-specs">
              <div><span>Updates:</span> <b>Automatic</b></div>
              <div><span>Safety:</span> <b>Google Verified</b></div>
              <div><span>Status:</span> <b className="status-badge">Coming Soon</b></div>
              <div><span>App ID:</span> <b>com.roshandigital.app</b></div>
            </div>
            <a
              href="https://play.google.com/store/apps/details?id=com.roshandigital.app"
              target="_blank"
              rel="noopener noreferrer"
              className="button button-light download-btn"
              style={{ opacity: 0.6, pointerEvents: 'none' }}
            >
              Coming to Play Store <span>→</span>
            </a>
            <small className="download-note">Currently under review</small>
          </div>
        </div>
      </section>

      {/* Installation Instructions */}
      <section className="section install-section">
        <div className="section-heading">
          <p className="eyebrow">HOW TO INSTALL <span></span></p>
          <h2>Installation Guide</h2>
          <p>Follow these simple steps to install Roshan Digital on your Android device.</p>
        </div>

        <div className="install-steps">
          <div className="install-step">
            <div className="step-number">1</div>
            <h3>Download the APK</h3>
            <p>
              Click the download button above to get the Roshan Digital APK file to your device.
            </p>
          </div>

          <div className="install-step">
            <div className="step-number">2</div>
            <h3>Enable Unknown Sources (First Time Only)</h3>
            <p>
              Go to <b>Settings → Security</b> and enable <b>"Unknown Sources"</b> to allow installation
              from external sources (you can disable this after installation).
            </p>
          </div>

          <div className="install-step">
            <div className="step-number">3</div>
            <h3>Open the APK File</h3>
            <p>
              Find the downloaded APK file in your device's file manager or Downloads folder and tap
              to open it.
            </p>
          </div>

          <div className="install-step">
            <div className="step-number">4</div>
            <h3>Confirm Installation</h3>
            <p>
              A prompt will appear asking to confirm installation. Tap <b>"Install"</b> and wait for the
              process to complete.
            </p>
          </div>

          <div className="install-step">
            <div className="step-number">5</div>
            <h3>Launch the App</h3>
            <p>
              Once installation is complete, tap <b>"Open"</b> or find Roshan Digital in your apps
              list to launch it.
            </p>
          </div>

          <div className="install-step">
            <div className="step-number">6</div>
            <h3>Create Your Account</h3>
            <p>
              Follow the guided onboarding to create your account and start using Roshan Digital
              securely.
            </p>
          </div>
        </div>
      </section>

      {/* Version Information */}
      <section className="section version-info">
        <div className="section-heading">
          <p className="eyebrow">VERSION INFORMATION <span></span></p>
          <h2>Current Release</h2>
        </div>

        <div className="version-details-card">
          <div className="version-detail">
            <span className="detail-label">Latest Version</span>
            <span className="detail-value">{liveApk.version}</span>
          </div>
          <div className="version-detail">
            <span className="detail-label">Build Number</span>
            <span className="detail-value">#{liveApk.build}</span>
          </div>
          <div className="version-detail">
            <span className="detail-label">Release Date</span>
            <span className="detail-value">{liveApk.releaseDate}</span>
          </div>
          <div className="version-detail">
            <span className="detail-label">File Size</span>
            <span className="detail-value">{liveApk.size}</span>
          </div>
          <div className="version-detail">
            <span className="detail-label">Min. Android</span>
            <span className="detail-value">{liveApk.minAndroid}</span>
          </div>
          <div className="version-detail">
            <span className="detail-label">Total Downloads</span>
            <span className="detail-value">{liveApk.downloads.toLocaleString()}</span>
          </div>
        </div>

        <div className="changelog-box">
          <h3>What's New in Version {liveApk.version}</h3>
          <ul>
            {liveApk.changelog.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="version-security">
          <h3>Security & Integrity</h3>
          <div className="security-info">
            <div>
              <strong>SHA-256 Hash:</strong>
              <code>{liveApk.sha256}</code>
            </div>
            <p>
              Verify the file integrity of your download using the SHA-256 hash above to ensure the
              APK is authentic and hasn't been tampered with.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section download-faq">
        <div className="section-heading">
          <p className="eyebrow">DOWNLOAD HELP <span></span></p>
          <h2>Frequently Asked Questions</h2>
        </div>

        <div className="faq-list" style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div className="faq-item">
            <div className="faq-question">
              <span>Is Roshan Digital free to download?</span>
              <span>+</span>
            </div>
            <div className="faq-answer">
              Yes, the Roshan Digital app is completely free to download and install on your Android
              device. There are no hidden charges for installation.
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              <span>What devices does it work on?</span>
              <span>+</span>
            </div>
            <div className="faq-answer">
              Roshan Digital requires Android {liveApk.minAndroid} and above. Check your device's
              Android version in Settings → About phone → Android version.
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              <span>How do I verify if the APK is authentic?</span>
              <span>+</span>
            </div>
            <div className="faq-answer">
              After downloading, use the SHA-256 hash above to verify the file. On Windows, use:
              <br />
              <code style={{ fontSize: '12px', color: '#10b981' }}>
                certutil -hashfile filename SHA256
              </code>
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              <span>What if installation fails?</span>
              <span>+</span>
            </div>
            <div className="faq-answer">
              Ensure you've enabled "Unknown Sources" in Security settings, have enough free storage
              space, and your device has a stable internet connection. If issues persist, contact
              support.
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              <span>Can I get automatic updates?</span>
              <span>+</span>
            </div>
            <div className="faq-answer">
              When available on Google Play, you'll receive automatic updates. For direct APK
              installs, check this page regularly for new versions or download new APK directly.
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="section download-support" style={{ background: 'rgba(16, 185, 129, 0.08)' }}>
        <div className="section-heading">
          <p className="eyebrow">NEED HELP? <span></span></p>
          <h2>We're Here to Support You</h2>
          <p>Contact us if you encounter any issues or have questions about downloading and installing Roshan Digital.</p>
        </div>

        <div className="support-options">
          <a href={`mailto:${siteSettings.supportEmail}`} className="support-card">
            <span className="support-icon">✉️</span>
            <b>Email Support</b>
            <span>{siteSettings.supportEmail}</span>
          </a>
          <a href={siteSettings.telegramLink} target="_blank" rel="noopener noreferrer" className="support-card">
            <span className="support-icon">💬</span>
            <b>Telegram Community</b>
            <span>Join our official channel</span>
          </a>
        </div>
      </section>
    </div>
  )
}
