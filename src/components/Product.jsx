import Footer from "./Footer";
import "./Home.css";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { usePurchases } from "../lib/usePurchases";

export default function Product() {
  const { user } = useUser();
  const { hasPurchasedMainProduct, loading: purchasesLoading } = usePurchases();
  return (
    <>
      <main className="hero-section">
        <div className="left-content">
          <h1>Product Page</h1>
          <p>
            Discover our exclusive pre-design guide for home owners. This
            product helps you plan, style, and transform your space with expert
            tips and inspiration.
          </p>
          {/* Show different buttons based on authentication and purchase status */}
          {!user ? (
            <a href="#" className="btn btn-primary">
              Buy Now
            </a>
          ) : purchasesLoading ? (
            <button className="btn btn-primary" disabled>
              Loading...
            </button>
          ) : hasPurchasedMainProduct() ? (
            <Link to="/dashboard" className="btn btn-success">
              View in Dashboard
            </Link>
          ) : (
            <a href="#" className="btn btn-primary">
              Buy Now
            </a>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
