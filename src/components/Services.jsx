import Footer from "./Footer";
import "./Services.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { usePurchases } from "../lib/usePurchases";

const FILTERS = [
  { label: "All Services", value: "all" },
  { label: "Residential", value: "residential" },
  { label: "Commercial", value: "commercial" },
  { label: "Consultation", value: "consultation" },
  { label: "Guides", value: "guides" },
];

const serviceDetails = [
  {
    title: "Residential Interior Design",
    img: "/assets/services-image/interior-design.jpg",
    badge: "Most Popular",
    desc: "Complete home transformation including space planning, material selection, and custom furniture design",
    category: "residential",
    features: [
      "Space planning & layout optimisation",
      "Material & finish selection",
      "Custom furniture design",
    ],
    duration: "4-6 week project",
  },
  {
    title: "Commercial Spaces",
    img: "/assets/services-image/commerical-architecture.avif",
    desc: "Brand-forward environments that command attention and inspire productivity",
    category: "commercial",
    features: ["Office design", "Retail spaces", "Brand integration"],
    duration: "Custom timeline",
  },
  {
    title: "Full-Service Interior Design",
    img: "/assets/services-image/interior-design.jpg",
    desc: "Immersive environments that create unforgettable guest experiences",
    category: "commercial",
    features: ["Hotel interiors", "Restaurant design", "Resort spaces"],
    duration: "6-8 week project",
  },
  {
    title: "Home Styling & Makeovers",
    img: "/assets/services-image/home-styling-makeover.jpg",
    badge: "Quick Turnaround",
    desc: "From idea to concept, we design homes that blend functionality with aesthetic appeal",
    category: "residential",
    features: [
      "Concept development",
      "3D visualization",
      "Construction drawings",
    ],
    duration: "2-3 week project",
  },
  {
    title: "Virtual Consultation",
    img: "/assets/services-image/virtual-onsight-consultance.jpg",
    badge: "Quick Service",
    desc: "Get professional design advice from the comfort of your home",
    category: "consultation",
    features: [
      "60-minute video session",
      "Personalized recommendations",
      "Follow-up notes",
    ],
    duration: "1-2 day turnaround",
  },
  {
    title: "Design Audits",
    img: "/assets/services-image/design-audits.jpg",
    desc: "Already have a space? Get a professional assessment of your current interiors",
    category: "consultation",
    features: [
      "Detailed space analysis",
      "Style diagnosis",
      "Quick fix cheat sheet",
    ],
    duration: "3-5 day turnaround",
  },
  {
    title: "E-Guides & Style Kits",
    img: "/assets/services-image/eguides-and-your.jpg",
    desc: "Empower your design journey with our curated, DIY-friendly resources",
    category: "guides",
    features: [
      "Know your style",
      "Smart decor investments",
      "Complete home playbook",
    ],
    duration: "Instant download",
    durationLink: true,
  },
];

export default function Services() {
  const [filter, setFilter] = useState("all");
  const { user } = useUser();
  const { hasPurchasedMainProduct, loading: purchasesLoading } = usePurchases();

  return (
    <>
      <div className="services-hero">
        <div className="hero-content">
          <h1 className="hero-title slide-up">Our Design Services</h1>
          <p
            className="hero-subtitle slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            Crafting spaces that tell your unique story
          </p>
        </div>
      </div>
      <section className="services-filter">
        <div className="filter-options">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={"filter-btn" + (filter === f.value ? " active" : "")}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>
      <main className="services-main">
        <div className="services-gallery">
          {serviceDetails
            .filter((s) => filter === "all" || s.category === filter)
            .map((service) => (
              <div
                className="service-item"
                data-category={service.category}
                key={service.title}
              >
                <div className="service-image">
                  <img src={service.img} alt={service.title} />
                  {service.badge && (
                    <span className="service-badge">{service.badge}</span>
                  )}
                  <div className="service-overlay">
                    <div className="service-content">
                      <h3>{service.title}</h3>
                      <p>{service.desc}</p>
                      <ul>
                        {service.features.map((f, i) => (
                          <li
                            key={i}
                            style={{ transitionDelay: `${0.1 + i * 0.1}s` }}
                          >
                            {f}
                          </li>
                        ))}
                      </ul>
                      {service.durationLink ? (
                        <>
                          {service.title === "E-Guides & Style Kits" ? (
                            // Special handling for E-Guides service
                            !user ? (
                              <a
                                href="#"
                                className="service-duration"
                                style={{
                                  color: "inherit",
                                  textDecoration: "none",
                                }}
                              >
                                {service.duration}
                              </a>
                            ) : purchasesLoading ? (
                              <span className="service-duration">
                                Loading...
                              </span>
                            ) : hasPurchasedMainProduct() ? (
                              <Link
                                to="/dashboard"
                                className="service-duration"
                                style={{
                                  color: "inherit",
                                  textDecoration: "none",
                                }}
                              >
                                View in Dashboard
                              </Link>
                            ) : (
                              <a
                                href="#"
                                className="service-duration"
                                style={{
                                  color: "inherit",
                                  textDecoration: "none",
                                }}
                              >
                                {service.duration}
                              </a>
                            )
                          ) : (
                            // Default behavior for other services
                            <a
                              href="#"
                              className="service-duration"
                              style={{
                                color: "inherit",
                                textDecoration: "none",
                              }}
                            >
                              {service.duration}
                            </a>
                          )}
                        </>
                      ) : (
                        <span className="service-duration">
                          {service.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </main>
      <section className="services-cta">
        <h2>Ready to Begin Your Design Journey?</h2>
        <p>
          Schedule a complimentary discovery call to discuss your vision and how
          we can bring it to life.
        </p>
        <div className="cta-buttons">
          <a href="/contact" className="btn btn-primary">
            Have a chat with us...
          </a>
        </div>
      </section>
      <Footer />
    </>
  );
}
