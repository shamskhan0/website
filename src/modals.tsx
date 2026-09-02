import { useState } from 'react'
import type { NewsItem } from './types'
import { DisclaimerModal } from './pages/DisclaimerPage'
import { CookiePolicyModal } from './pages/CookiePolicyPage'

export function ArticleReaderModal({
  article,
  onClose,
}: {
  article: NewsItem
  onClose: () => void
}) {
  const isKyc = article.tag === 'KYC VERIFICATION'

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="modal-title-lockup">
            <img src="/roshan-digital-logo-transparent.png" alt="Roshan Digital" />
            <div>
              <span style={{ fontSize: '10px', color: 'var(--emerald)', fontWeight: 800, letterSpacing: '1px' }}>
                {article.tag}
              </span>
              <p style={{ margin: 0 }}>{article.date} · {article.author || 'Roshan Digital Security & Compliance'}</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close article">×</button>
        </header>
        <div className="modal-body" style={{ maxHeight: '70vh' }}>
          {article.imageUrl && (
            <div style={{ borderRadius: '12px', overflow: 'hidden', height: '260px', marginBottom: '20px', position: 'relative' }}>
              <img src={article.imageUrl} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <h2 style={{ fontSize: '24px', color: '#fff', margin: '0 0 16px 0', lineHeight: 1.3 }}>
            {article.title}
          </h2>
          <p style={{ fontSize: '15px', color: '#cbd5e1', lineHeight: 1.7, marginBottom: '20px' }}>
            {article.text}
          </p>

          {isKyc ? (
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
              <h4 style={{ color: 'var(--emerald)', margin: '0 0 12px 0', fontSize: '15px' }}>
                ✦ 3 Simple Steps to Complete Verification:
              </h4>
              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'rgba(15, 23, 42, 0.6)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ background: 'var(--emerald)', color: '#000', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', flexShrink: 0 }}>1</span>
                  <div>
                    <b style={{ color: '#fff', fontSize: '13px' }}>Government Identity Document</b>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>Upload a clear photo of your valid CNIC, National ID, or International Passport.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'rgba(15, 23, 42, 0.6)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ background: 'var(--emerald)', color: '#000', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', flexShrink: 0 }}>2</span>
                  <div>
                    <b style={{ color: '#fff', fontSize: '13px' }}>Biometric Liveness Scan</b>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>Complete a fast 5-second 3D selfie scan to match your face with your ID.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'rgba(15, 23, 42, 0.6)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ background: 'var(--emerald)', color: '#000', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', flexShrink: 0 }}>3</span>
                  <div>
                    <b style={{ color: '#fff', fontSize: '13px' }}>Instant Automated Activation</b>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>Our secure bank-grade AI verifies your account credentials in under 2 minutes.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '12px', padding: '18px 20px', marginBottom: '20px' }}>
              <h4 style={{ color: 'var(--emerald)', margin: '0 0 8px 0', fontSize: '14px' }}>Key Architecture Takeaways:</h4>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#94a3b8', fontSize: '13px' }}>
                <li>Real-time telemetry and predictive daily profit adjustments via automated AI indicator weighting.</li>
                <li>Bank-grade security isolation backed by 256-bit AES encryption standards.</li>
                <li>Seamless synchronized mobile app integration for instant updates and push telemetry.</li>
              </ul>
            </div>
          )}
        </div>
        <footer className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="text-link" onClick={onClose}>Back to Stories</button>
          <a
            className="button button-primary"
            href="#app"
            onClick={onClose}
          >
            {isKyc ? 'Start KYC in App →' : 'Explore Platform →'}
          </a>
        </footer>
      </div>
    </div>
  )
}

export function PrivacyPolicyModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="modal-title-lockup">
            <img src="/roshan-digital-logo-transparent.png" alt="Roshan Digital" />
            <div>
              <h2>Privacy Policy</h2>
              <p>Roshan Digital Data Protection & Privacy</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        </header>
        <div className="modal-body">
          <p><strong>Effective Date:</strong> August 27, 2026</p>
          <p>At Roshan Digital, your security and privacy are our top priorities. This Privacy Policy explains how we collect, use, protect, and handle your information across all Roshan Digital services and applications.</p>
          
          <h3>1. Information We Collect</h3>
          <p>We collect essential operational information necessary to provide AI-powered portfolio insights and secure digital account services:</p>
          <ul>
            <li><strong>Account Information:</strong> Name, verified email address, phone number, and security credentials.</li>
            <li><strong>Financial Analytics:</strong> Secure investment transaction records and analytics logs encrypted end-to-end.</li>
            <li><strong>Device & Usage Data:</strong> IP address, device model, operating system version, and anonymous crash telemetry.</li>
            <li><strong>Biometric Data (KYC):</strong> Facial scan data used solely for identity verification — not stored beyond verification completion.</li>
            <li><strong>Location Data:</strong> General region data for regulatory compliance only. Precise GPS is never collected.</li>
          </ul>

          <h3>2. How We Use Your Data</h3>
          <ul>
            <li>Provide, maintain, and improve our AI investment services</li>
            <li>Verify your identity and prevent fraudulent activity</li>
            <li>Send important service notifications and security alerts</li>
            <li>Comply with applicable financial regulations and legal obligations</li>
            <li>Analyse anonymous usage patterns to improve app performance</li>
          </ul>

          <h3>3. How We Protect Your Data</h3>
          <p>All sensitive communications and database storage utilize AES-256 and TLS 1.3 cryptographic encryption. We strictly implement zero-knowledge architecture for user credentials and automated AI models.</p>

          <h3>4. Third-Party Services & SDKs</h3>
          <p>Our application and website integrate the following third-party services, each with their own privacy practices:</p>
          <ul>
            <li><strong>Google AdSense:</strong> Displays advertising on our website. Google may use cookies to serve relevant ads. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--emerald)' }}>Google's Privacy Policy</a>.</li>
            <li><strong>Google Analytics (if enabled):</strong> Anonymous traffic analysis. Data is anonymised before processing.</li>
          </ul>
          <p>We do not sell, rent, or trade your personal or financial data to any third parties or advertising brokers beyond the disclosures above.</p>

          <h3>5. Data Retention</h3>
          <p>We retain your personal data only as long as necessary to provide our services or as required by law. Account data is deleted within 30 days of account closure upon request.</p>

          <h3>6. Your Rights — Data Deletion Request</h3>
          <p>You have the right to request deletion of your personal data at any time. To submit a deletion request:</p>
          <ul>
            <li>Email: <a href="mailto:privacy@roshandigital.com" style={{ color: 'var(--emerald)', textDecoration: 'underline' }}>privacy@roshandigital.com</a> with subject <strong>"Data Deletion Request"</strong></li>
            <li>We will process your request within 30 days and confirm deletion via email</li>
          </ul>
          <p>You also retain rights to: <strong>access</strong> your data, <strong>correct</strong> inaccurate data, <strong>port</strong> your data to another service, and <strong>object</strong> to certain processing (GDPR / CCPA applicable users).</p>

          <h3>7. Children's Privacy (COPPA)</h3>
          <p>Roshan Digital services are not directed to children under the age of 18. We do not knowingly collect personal information from minors. If you believe a minor has provided us data, contact <a href="mailto:privacy@roshandigital.com" style={{ color: 'var(--emerald)' }}>privacy@roshandigital.com</a> immediately.</p>

          <h3>8. Changes to This Policy</h3>
          <p>We may update this policy periodically. We will notify users of significant changes via in-app notification or email. Continued use of the service constitutes acceptance of the updated policy.</p>

          <h3>9. Contact Our Privacy Officer</h3>
          <p>For any privacy inquiries or formal data requests, contact: <a href="mailto:privacy@roshandigital.com" style={{ color: 'var(--emerald)', textDecoration: 'underline' }}>privacy@roshandigital.com</a>.</p>
        </div>
        <footer className="modal-footer">
          <button className="button button-primary" onClick={onClose}>I Understand</button>
        </footer>
      </div>
    </div>
  )
}

export function HelpCenterModal({ onClose }: { onClose: () => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const faqs = [
    {
      q: 'How do I download and install the latest APK?',
      a: 'Click the "Download latest APK" button in the App section or header. Once downloaded, tap the file on your Android device (version 8.0+) and follow the on-screen prompts to complete installation.',
    },
    {
      q: 'How does AI-assisted investing work on Roshan Digital?',
      a: 'Our smart algorithms analyze real-time market movements, risk profiles, and automated rebalancing indicators to maximize daily profit potential while maintaining disciplined risk control.',
    },
    {
      q: 'Are my funds and account credentials secure?',
      a: 'Yes. Roshan Digital utilizes multi-factor authentication, cold-storage security protocols, and 256-bit SSL encryption to ensure bank-grade protection for all accounts.',
    },
    {
      q: 'How can I reach 24/7 official support?',
      a: 'You can email our customer assistance team directly at support@roshandigital.com or connect via our verified live support channels.',
    },
  ]

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="modal-title-lockup">
            <img src="/roshan-digital-logo-transparent.png" alt="Roshan Digital" />
            <div>
              <h2>Help Centre</h2>
              <p>Guides, FAQs & 24/7 Official Support</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        </header>
        <div className="modal-body">
          <h3>Frequently Asked Questions</h3>
          {faqs.map((faq, index) => (
            <div className="faq-item" key={faq.q} onClick={() => setOpenFaq(openFaq === index ? null : index)}>
              <div className="faq-question">
                <span>{faq.q}</span>
                <span>{openFaq === index ? '−' : '+'}</span>
              </div>
              {openFaq === index && <div className="faq-answer">{faq.a}</div>}
            </div>
          ))}

          <h3>Need Instant Assistance?</h3>
          <div className="help-contact-cards">
            <a href="mailto:support@roshandigital.com" className="help-card">
              <b>✉ Email Support</b>
              <span>support@roshandigital.com</span>
            </a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); onClose(); }} className="help-card">
              <b>⚡ Live Inquiries</b>
              <span>Contact Page</span>
            </a>
          </div>
        </div>
        <footer className="modal-footer">
          <button className="button button-primary" onClick={onClose}>Close Help Centre</button>
        </footer>
      </div>
    </div>
  )
}

export function AboutModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="modal-title-lockup">
            <img src="/roshan-digital-logo-transparent.png" alt="Roshan Digital" />
            <div>
              <h2>About Roshan Digital</h2>
              <p>Secure Investments. Daily Profits. Smarter Decisions with AI.</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        </header>
        <div className="modal-body">
          <h3>Our Mission</h3>
          <p>Roshan Digital is committed to empowering individuals and businesses with intelligent financial tools, algorithmic security, and seamless mobile services built for the future of digital wealth.</p>

          <h3>Key Pillars</h3>
          <ul>
            <li><strong>AI-Driven Intelligence:</strong> Modern algorithmic strategies designed to uncover optimal financial outcomes.</li>
            <li><strong>Transparent Governance:</strong> Zero hidden fees, clear operations, and round-the-clock visibility.</li>
            <li><strong>Enterprise Reliability:</strong> 99.99% system uptime and continuous platform innovations.</li>
          </ul>

          <h3>Official Releases</h3>
          <p>Every version of the Roshan Digital mobile application undergoes rigorous security auditing and cryptographic verification prior to public deployment.</p>
        </div>
        <footer className="modal-footer">
          <button className="button button-primary" onClick={onClose}>Back to Website</button>
        </footer>
      </div>
    </div>
  )
}

export { DisclaimerModal } from './pages/DisclaimerPage'
export { CookiePolicyModal } from './pages/CookiePolicyPage'

export function TermsOfServiceModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="modal-title-lockup">
            <img src="/roshan-digital-logo-transparent.png" alt="Roshan Digital" />
            <div>
              <h2>Terms of Service</h2>
              <p>Roshan Digital User Agreement</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        </header>
        <div className="modal-body">
          <p><strong>Effective Date:</strong> August 27, 2026</p>
          <p>
            By downloading, installing, or using the Roshan Digital application or website, you agree to
            be bound by these Terms of Service. Please read them carefully before proceeding.
          </p>

          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing or using any part of Roshan Digital's services, you confirm that you are at
            least 18 years of age, legally capable of entering into binding agreements, and agree to
            comply with these terms and all applicable laws and regulations.
          </p>

          <h3>2. Use of Services</h3>
          <p>
            Roshan Digital grants you a limited, non-exclusive, non-transferable licence to use our
            application and services for lawful personal purposes. You agree not to misuse, reverse
            engineer, or attempt unauthorised access to any part of our platform.
          </p>

          <h3>3. Investment Disclaimer</h3>
          <p>
            All AI-generated insights, portfolio recommendations, and return projections are provided for
            informational purposes only and do not constitute financial or investment advice. Past
            performance does not guarantee future results. Always consult a certified financial advisor
            before making investment decisions.
          </p>

          <h3>4. Account Responsibility</h3>
          <p>
            You are fully responsible for maintaining the confidentiality of your account credentials.
            Roshan Digital is not liable for any loss arising from unauthorised use of your account due
            to your failure to keep login details secure.
          </p>

          <h3>5. Intellectual Property</h3>
          <p>
            All content, branding, code, and designs within the Roshan Digital platform are the exclusive
            intellectual property of Roshan Digital. Unauthorised reproduction or distribution is
            strictly prohibited.
          </p>

          <h3>6. Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by law, Roshan Digital shall not be liable for indirect,
            incidental, or consequential damages arising from your use of our services, including loss of
            profits or data.
          </p>

          <h3>7. Modifications to Terms</h3>
          <p>
            We reserve the right to update these terms at any time. Continued use of the service after
            changes are posted constitutes your acceptance of the revised terms.
          </p>

          <h3>8. Governing Law</h3>
          <p>
            These terms are governed by and construed in accordance with the laws of Pakistan.
            Any disputes shall be subject to the exclusive jurisdiction of the courts of Pakistan.
          </p>

          <h3>9. Contact</h3>
          <p>
            For any questions about these Terms of Service, contact us at:{' '}
            <a href="mailto:legal@roshandigital.com" style={{ color: 'var(--emerald)', textDecoration: 'underline' }}>
              legal@roshandigital.com
            </a>
          </p>
        </div>
        <footer className="modal-footer">
          <button className="button button-primary" onClick={onClose}>I Agree & Close</button>
        </footer>
      </div>
    </div>
  )
}
