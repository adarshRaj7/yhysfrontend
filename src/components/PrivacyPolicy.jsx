import Footer from "./Footer";
import "./Home.css";

export default function PrivacyPolicy() {
  return (
    <>
      <div className="policy-container">
        <div className="policy-content">
          <h1 className="policy-title">Privacy Policy</h1>
          <div className="policy-update">Last updated: 2024</div>
          <div className="policy-section">
            <h2>Introduction</h2>
            <p>
              Your privacy is important to us. This Privacy Policy explains how
              we collect, use, and protect your information when you use our
              website.
            </p>
          </div>
          <div className="policy-section">
            <h2>Information We Collect</h2>
            <ul>
              <li>
                Personal identification information (Name, email address, etc.)
              </li>
              <li>Usage data and cookies</li>
            </ul>
          </div>
          <div className="policy-section">
            <h2>How We Use Information</h2>
            <ul>
              <li>To provide and maintain our service</li>
              <li>To notify you about changes</li>
              <li>To improve our website</li>
            </ul>
          </div>
          <div className="policy-section">
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, contact us at{" "}
              <a href="mailto:aditiujjain.arch@gmail.com">
                aditiujjain.arch@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
