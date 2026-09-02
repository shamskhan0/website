export function DisclaimerModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="modal-title-lockup">
            <img src="/roshan-digital-logo-transparent.png" alt="Roshan Digital" />
            <div>
              <h2>Disclaimer</h2>
              <p>Important Legal and Financial Disclaimer</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        </header>
        <div className="modal-body">
          <p><strong>Last Updated:</strong> August 27, 2026</p>

          <h3>1. General Disclaimer</h3>
          <p>
            This website and the Roshan Digital application ("Service") are provided on an "as-is" and
            "as-available" basis. Roshan Digital makes no warranties, expressed or implied, regarding
            the accuracy, completeness, or timeliness of any information contained herein.
          </p>

          <h3>2. No Financial Advice</h3>
          <p>
            <strong>IMPORTANT:</strong> Nothing contained in this website or application constitutes
            financial, investment, legal, tax, or professional advice. All content is provided for
            informational purposes only. Roshan Digital does not provide personalized financial
            recommendations.
          </p>
          <p>
            Before making any investment decisions, you should consult with a qualified financial
            advisor, legal counsel, or tax professional who understands your individual financial
            situation and goals.
          </p>

          <h3>3. Investment Risk Disclosure</h3>
          <p>
            <strong>All investments involve risk, including the potential loss of principal.</strong>
          </p>
          <ul>
            <li>Past performance is not indicative of future results</li>
            <li>Investment returns and principal value will fluctuate</li>
            <li>Shares, when redeemed, may be worth more or less than their original cost</li>
            <li>There is no guarantee of profit or return on investment</li>
            <li>Market conditions can change rapidly and unpredictably</li>
          </ul>

          <h3>4. AI and Algorithmic Decisions</h3>
          <p>
            Roshan Digital uses artificial intelligence and algorithmic tools to provide insights and
            recommendations. These tools are provided for educational and informational purposes only.
          </p>
          <ul>
            <li>AI-generated recommendations are not guaranteed to be accurate</li>
            <li>Algorithms may fail or produce unexpected results</li>
            <li>Market conditions may change between recommendation generation and execution</li>
            <li>You are solely responsible for any decisions made based on AI insights</li>
          </ul>

          <h3>5. No Liability for Market Loss</h3>
          <p>
            Roshan Digital is not responsible for any losses, damages, or negative outcomes resulting
            from your use of the service, including but not limited to:
          </p>
          <ul>
            <li>Investment losses or poor market performance</li>
            <li>Incorrect AI recommendations or algorithm failures</li>
            <li>Market volatility or sudden price movements</li>
            <li>Your investment decisions or actions</li>
            <li>Third-party failures or market disruptions</li>
          </ul>

          <h3>6. User Responsibility</h3>
          <p>
            You acknowledge and agree that:
          </p>
          <ul>
            <li>You are responsible for all decisions made using the Roshan Digital service</li>
            <li>You understand the risks associated with digital investments</li>
            <li>You have conducted your own research and due diligence</li>
            <li>You are not relying solely on Roshan Digital for investment decisions</li>
            <li>You are of legal age to use financial services in your jurisdiction</li>
          </ul>

          <h3>7. No Warranty of Accuracy</h3>
          <p>
            While we strive to provide accurate information, Roshan Digital does not guarantee the
            accuracy, reliability, or completeness of any data, market information, or analysis
            provided through the service.
          </p>

          <h3>8. Regulatory Compliance</h3>
          <p>
            Roshan Digital operates in compliance with applicable laws and regulations. However, the
            regulatory status of digital financial services varies by jurisdiction. Users are
            responsible for understanding the legal implications of using Roshan Digital in their
            country or region.
          </p>

          <h3>9. Third-Party Links and Services</h3>
          <p>
            The website and application may contain links to third-party websites or services.
            Roshan Digital is not responsible for the content, accuracy, or practices of these
            external sites.
          </p>

          <h3>10. Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by law, Roshan Digital and its officers, employees,
            agents, and affiliates shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages, including but not limited to:
          </p>
          <ul>
            <li>Loss of profits or revenue</li>
            <li>Loss of data or business</li>
            <li>Decreased goodwill</li>
            <li>Work stoppage or computer failure</li>
          </ul>

          <h3>11. Device and Technical Issues</h3>
          <p>
            Roshan Digital is not responsible for technical failures, device malfunctions, software
            bugs, or connectivity issues that may impact your ability to use the service.
          </p>

          <h3>12. Security and Account Protection</h3>
          <p>
            While Roshan Digital employs security measures, no system is completely secure. Users are
            responsible for protecting their account credentials and reporting unauthorized access
            immediately.
          </p>

          <h3>13. Disclaimer Changes</h3>
          <p>
            Roshan Digital reserves the right to modify this disclaimer at any time. Continued use
            of the service following any changes constitutes your acceptance of the revised terms.
          </p>

          <h3>14. Questions or Concerns</h3>
          <p>
            If you have questions about this disclaimer or the risks associated with using Roshan
            Digital, please contact:
          </p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:support@roshandigital.com" style={{ color: 'var(--emerald)' }}>support@roshandigital.com</a></li>
            <li><strong>Legal:</strong> <a href="mailto:legal@roshandigital.com" style={{ color: 'var(--emerald)' }}>legal@roshandigital.com</a></li>
          </ul>

          <div style={{ marginTop: '28px', padding: '16px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px' }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
              <strong style={{ color: '#10b981' }}>BY USING ROSHAN DIGITAL,</strong> you acknowledge that
              you have read, understood, and agree to be bound by this disclaimer and all associated risks.
            </p>
          </div>
        </div>
        <footer className="modal-footer">
          <button className="button button-primary" onClick={onClose}>I Understand the Risks</button>
        </footer>
      </div>
    </div>
  )
}
