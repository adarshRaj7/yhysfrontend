import Footer from "./Footer";
import "./About.css";

export default function About() {
  return (
    <>
      <main className="about-container">
        <div className="about-left fade-in">
          <div className="image-wrapper">
            <img
              src="/assets/aditi.png"
              alt="Aditi Ujjain"
              className="about-image slide-left"
            />
          </div>
        </div>
        <div className="about-right slide-up">
          <h1 className="about-title">About Me</h1>
          <p className="about-hi">Hello, I'm Aditi Ujjain</p>
          <div className="about-description">
            <p>
              I'm an architect and interior designer passionate about creating
              spaces that are both functional and aesthetically inspiring.
            </p>
            <p>
              My design philosophy blends smart space solutions with culturally
              inspired modern aesthetics, resulting in environments that tell a
              story while serving their purpose beautifully.
            </p>
            <p>
              With a keen eye for detail and a commitment to excellence, I
              approach each project as a unique opportunity to transform visions
              into tangible, livable art.
            </p>
          </div>
          <div className="about-cta">
            <p className="about-check">Explore my work on these platforms:</p>
            <div className="about-links">
              <a
                href="https://www.behance.net/aditiujjain2"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <div className="icon-container">
                  <img
                    src="/assets/behance.webp"
                    alt="Behance"
                    className="link-icon"
                  />
                </div>
              </a>
              <a
                href="https://www.linkedin.com/in/aditi-ujjain-2720b11b2"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <div className="icon-container">
                  <img
                    src="/assets/linkedin.png"
                    alt="LinkedIn"
                    className="link-icon"
                  />
                </div>
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
