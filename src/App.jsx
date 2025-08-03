import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Services from "./components/Services";
import Product from "./components/Product";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Terms from "./components/Terms";
import Login from "./components/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import RequireAuth from "./components/RequireAuth";
import { useState } from "react";
import "./App.css";

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const handleLoginOpen = () => {
    setShowLoginModal(true);
  };
  const handleLoginClose = () => setShowLoginModal(false);

  // Custom handler to close modal and redirect
  const LoginModal = () => {
    const navigate = useNavigate();
    const handleLoginSuccess = () => {
      setShowLoginModal(false);
      // Only navigate to dashboard if we're not on the home page
      // This allows payment flow to continue on home page
      if (window.location.pathname !== "/") {
        navigate("/dashboard");
      }
      // If we're on home page, stay there to let payment modal show
    };
    return <Login onLoginSuccess={handleLoginSuccess} />;
  };

  return (
    <Router>
      <Header onLoginClick={handleLoginOpen} />
      <Routes>
        <Route path="/" element={<Home onLoginClick={handleLoginOpen} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/product" element={<Product />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        {/* Add more routes for other pages later */}
      </Routes>
      {/* <Footer /> */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={handleLoginClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleLoginClose}>
              &times;
            </button>
            <LoginModal />
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;
