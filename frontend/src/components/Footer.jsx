import { ShieldCheck } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container container">
        <div className="footer-top">
          <div className="footer-brand">
             <div className="logo">
                <ShieldCheck size={24} color="var(--brand-green)" />
                <span style={{fontWeight: 'bold', fontSize: '20px', color: 'var(--brand-dark)'}}>AuditEase</span>
             </div>
             <p>Intelligent compliance for modern teams.</p>
          </div>
          <div className="footer-links">
            <div className="link-column">
              <h4>Segment</h4><a href="#">Startups</a><a href="#">SMBs</a><a href="#">Enterprise</a>
            </div>
            <div className="link-column">
              <h4>Resources</h4><a href="#">Blog</a><a href="#">Frameworks</a><a href="#">Docs</a>
            </div>
            <div className="link-column">
              <h4>Company</h4><a href="#">About Us</a><a href="#">Careers</a><a href="#">Contact</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-legal">
             <span>© 2026 AuditEase. All rights reserved.</span>
             <div className="legal-links"><a href="#">Privacy</a><a href="#">Terms</a></div>
          </div>
        </div>
      </div>
    </footer>
  );
}