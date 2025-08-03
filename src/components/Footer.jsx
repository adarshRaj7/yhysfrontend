import "./Footer.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function Footer() {
  useEffect(() => {
    // Set current year
    const yearEl = document.getElementById("current-year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    // Time-of-day theme (IST)
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const ist = new Date(utc + 5.5 * 3600000).getHours();
    const footer = document.querySelector(".site-footer");
    if (footer) {
      footer.classList.remove("daytime", "evening", "night");
      if (ist >= 6 && ist < 17) footer.classList.add("daytime");
      else if (ist >= 17 && ist < 19) footer.classList.add("evening");
      else footer.classList.add("night");
    }
  }, []);

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-cta-group">
          <p className="footer-text">Get periodic insights of home styling</p>
          <div className="arrow-pointer">
            <span>↓</span>
          </div>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSekjWHH7oIGwqyNQdYqNpMfwpp95YeBqTRgLhvzCWegFRg3IQ/viewform"
            className="footer-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            SIGN UP FOR FREE
          </a>
        </div>
        <div className="social-section">
          <p className="footer-connect">LET'S CONNECT!</p>
          <div className="social-buttons">
            <a
              href="https://www.linkedin.com/in/aditi-ujjain-2720b11b2"
              className="social-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/assets/linkedin.png" alt="LinkedIn" />
            </a>
            <a
              href="https://www.instagram.com/aditi._.e"
              className="social-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/assets/instagram.webp" alt="Instagram" />
            </a>
            <a
              href="https://in.pinterest.com/ujjainaditi933/?invite_code=37592e7cf4d24bf48321fb911ffd2fc0&sender=654570264499272995"
              className="social-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/assets/pinterest.png" alt="Pinterest" />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          &copy; <span id="current-year"></span> Your Home Your Style. All
          rights reserved.
          <span className="footer-separator">|</span>
          <Link to="/privacy-policy" className="footer-bottom-link">
            Privacy Policy
          </Link>
          <span className="footer-separator">|</span>
          <Link to="/terms" className="footer-bottom-link">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
