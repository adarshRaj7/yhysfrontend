import { Link, NavLink } from "react-router-dom";
import "./Header.css";
import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import Cookies from "js-cookie";

import axiosInstance from "../lib/axiosInstance";

export default function Header({ onLoginClick = () => {} }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useUser();

  const handleLoginClick = () => {
    onLoginClick();
  };

  const handleToggle = () => setMenuOpen(!menuOpen);
  const handleClose = () => setMenuOpen(false);
  const handleLogout = async () => {
    try {
      const token =
        Cookies.get("authToken") || localStorage.getItem("authToken");

      // Call backend logout BEFORE signing out from Firebase
      try {
        await axiosInstance.post(
          "/auth/signout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch {
        // Continue with logout even if backend call fails
      }

      // Now sign out from Firebase
      await signOut(auth);

      // Clear the auth token from both cookie and localStorage
      Cookies.remove("authToken");
      localStorage.removeItem("authToken");

      // Reload the page to reset the app state
      window.location.reload();
    } catch {
      // Even if something fails, clear the token and reload
      Cookies.remove("authToken");
      localStorage.removeItem("authToken");
      window.location.reload();
    }
  };

  return (
    <header className="site-header">
      <div className="container">
        <button
          className={`menu-toggle${menuOpen ? " active" : ""}`}
          aria-label="Menu"
          onClick={handleToggle}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        <nav className={`main-nav${menuOpen ? " active" : ""}`}>
          <ul>
            <li>
              <NavLink to="/" onClick={handleClose} end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" onClick={handleClose}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" onClick={handleClose}>
                Services
              </NavLink>
            </li>
            <li>
              <a
                href="https://www.behance.net/gallery/219386277/COMPILED-PROJECTS_PORTFOLIO"
                target="_blank"
                rel="noopener noreferrer"
              >
                Portfolio
              </a>
            </li>
            <li>
              <NavLink to="/contact" onClick={handleClose}>
                Contact
              </NavLink>
            </li>
            {user ? (
              <>
                <li>
                  <NavLink to="/dashboard" onClick={handleClose}>
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <button
                    className="login-btn"
                    onClick={handleLogout}
                    type="button"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button
                    className="login-btn"
                    onClick={handleLoginClick}
                    type="button"
                  >
                    Login
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
        {menuOpen && (
          <div className="nav-overlay active" onClick={handleToggle}></div>
        )}
      </div>
    </header>
  );
}
