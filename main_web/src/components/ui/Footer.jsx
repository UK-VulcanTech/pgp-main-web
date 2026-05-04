import { Link } from "react-router-dom";

function ExternalLink({ href, children, label }) {
  return (
    <a href={href} aria-label={label}>
      {children}
    </a>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <img
                className="footer-brand__img"
                src="/images/pgp-logo-white.png"
                alt=""
                width="188"
                height="151"
              />
              <span>Peak Global Partners</span>
            </div>
            <p className="footer-tagline">
              Building systems that last. A full-service technology services partner
              for complex, multi-stakeholder initiatives — from strategy through
              sustainable operations.
            </p>
            <div className="footer-contact">
              <div>
                724 W. Lancaster Ave, Suite 210
                <br />
                Wayne, PA 19087
              </div>
              <div>
                <a href="tel:+16106024200">610-602-4200</a>
              </div>
              <div>
                <a href="mailto:info@peakglobalpartners.com">
                  info@peakglobalpartners.com
                </a>
              </div>
            </div>
          </div>

          <div className="footer-col">
            <h4>Solutions</h4>
            <ul>
              <li>
                <Link to="/solutions/energy-infrastructure">Energy Infrastructure</Link>
              </li>
              <li>
                <Link to="/solutions/renewables">Renewables</Link>
              </li>
              <li>
                <Link to="/solutions/water-sanitation">Water & Sanitation</Link>
              </li>
              <li>
                <Link to="/solutions/waste-recycling">Waste & Recycling</Link>
              </li>
              <li>
                <Link to="/solutions/technology">Technology</Link>
              </li>
              <li>
                <Link to="/solutions/transportation">Transportation</Link>
              </li>
              <li>
                <Link to="/solutions/healthcare">Healthcare</Link>
              </li>
              <li>
                <Link to="/solutions/real-estate">Real Estate</Link>
              </li>
              <li>
                <Link to="/solutions/capital-access">Capital Access</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Training</h4>
            <ul>
              <li>
                <Link to="/training/skills-transfer">Skills Transfer</Link>
              </li>
              <li>
                <Link to="/training/intelligence-training">Intelligence Training</Link>
              </li>
              <li>
                <Link to="/training/technology-training">Technology Training</Link>
              </li>
              <li>
                <Link to="/training/cybersecurity-training">Cybersecurity Training</Link>
              </li>
              <li>
                <Link to="/training/digital-workforce-training">Digital Workforce Training</Link>
              </li>
            </ul>
            <h4 style={{ marginTop: "var(--space-7)" }}>Company</h4>
            <ul>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/approach">Approach</Link>
              </li>
              <li>
                <Link to="/digital-fast-track">Digital Fast Track</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Get in touch</h4>
            <ul>
              <li>
                <Link to="/contact">Request a consultation</Link>
              </li>
              <li>
                <Link to="/contact">Capability briefing</Link>
              </li>
              <li>
                <Link to="/contact">Partnership inquiry</Link>
              </li>
              <li>
                <Link to="/contact">Media & press</Link>
              </li>
            </ul>
            <h4 style={{ marginTop: "var(--space-7)" }}>Follow</h4>
            <div className="footer-social">
              <ExternalLink href="#" label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
                </svg>
              </ExternalLink>
              <ExternalLink href="#" label="X / Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817-5.97 6.817H1.67l7.73-8.835L1.244 2.25h6.83l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </ExternalLink>
              <ExternalLink href="#" label="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </ExternalLink>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© {year} Peak Global Partners, LLC · All rights reserved</div>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Site Map</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
