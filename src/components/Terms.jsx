import Footer from "./Footer";
import "./Home.css";

export default function Terms() {
  return (
    <>
      <div className="policy-container">
        <div className="policy-content">
          <h1 className="policy-title">Terms of Service</h1>
          <div className="policy-update">Last updated: 2024</div>
          <div className="policy-section">
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing or using this website, you agree to be bound by these
              Terms of Service.
            </p>
          </div>
          <div className="policy-section">
            <h2>Use of the Website</h2>
            <ul>
              <li>You agree to use the website only for lawful purposes.</li>
              <li>You must not misuse the website or its content.</li>
            </ul>
          </div>
          <div className="policy-section">
            <h2>Intellectual Property</h2>
            <p>
              All content on this website is the property of Your Home Your
              Style unless otherwise stated.
            </p>
          </div>
          <div className="policy-section">
            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms, contact us at{" "}
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
