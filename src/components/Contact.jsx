import Footer from "./Footer";
import "./Contact.css";

export default function Contact() {
  return (
    <>
      <main className="contact-main">
        <section className="contact-hero">
          <div className="hero-content">
            <h1 className="hero-title slide-up">Let's Create Together</h1>
            <p
              className="hero-subtitle slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              Your vision, our expertise - beautifully combined
            </p>
          </div>
        </section>
        <div className="contact-container">
          <div className="contact-info">
            <h2 className="contact-title">Get In Touch</h2>
            <p className="contact-text">
              We'd love to hear about your project and discuss how we can bring
              your design vision to life. Reach out using any of the methods
              below.
            </p>
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <div className="contact-label">Location</div>
                  <div className="contact-value">
                    Gandhi Nagar
                    <br />
                    Gujarat, India
                  </div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <div className="contact-label">Call Us</div>
                  <div className="contact-value">
                    <a href="tel:+917529000925">+91 7529000925</a>
                  </div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div>
                  <div className="contact-label">Email Us</div>
                  <div className="contact-value">
                    <a href="mailto:ujjainaditi933@gmail.com">
                      ujjainaditi933@gmail.com
                    </a>
                  </div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">🕒</div>
                <div>
                  <div className="contact-label">Working Hours</div>
                  <div className="contact-value">
                    Monday - Friday: 9am - 8pm
                    <br />
                    Saturday: 10am - 9pm
                  </div>
                </div>
              </div>
            </div>
            <div className="social-links">
              <a
                href="https://www.instagram.com/aditi._.e"
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/assets/instagram.webp"
                  alt="Instagram"
                  className="social-logo"
                />
              </a>
              <a
                href="https://www.linkedin.com/in/aditi-ujjain-2720b11b2"
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/assets/linkedin.png"
                  alt="LinkedIn"
                  className="social-logo"
                />
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
