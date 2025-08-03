import { useRef, useState } from "react";
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGooglePlusG } from "@fortawesome/free-brands-svg-icons";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useSignIn } from "../lib/useSignIn";
import { useSignUp } from "../lib/useSignUp";

export default function Login({ onLoginSuccess }) {
  const containerRef = useRef(null);
  // State for sign in form
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  // State for sign up form
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const { handleSignIn, signInLoading, signInError } =
    useSignIn(onLoginSuccess);
  const { handleSignUp, signUpLoading, signUpError, signUpSuccess } =
    useSignUp();

  const handleSignUpClick = () => {
    containerRef.current.classList.add("right-panel-active");
  };
  const handleSignInClick = () => {
    containerRef.current.classList.remove("right-panel-active");
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    handleSignIn(signInEmail, signInPassword);
  };

  // Replace the old handleSignUp with a simple submit handler
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    handleSignUp(signUpName, signUpEmail, signUpPassword, signUpUsername);
    setSignUpName("");
    setSignUpEmail("");
    setSignUpUsername("");
    setSignUpPassword("");
  };

  // Google OAuth handler (Firebase)
  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      if (token) {
        const Cookies = await import("js-cookie");
        Cookies.default.set("authToken", token, { expires: 7 });
      }
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      alert("Google sign-in failed: " + err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container" id="container" ref={containerRef}>
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignUpSubmit}>
            <h1>Create Account</h1>
            <div className="social-container">
              <a href="#" className="social" onClick={handleGoogleSignIn}>
                <FontAwesomeIcon icon={faGooglePlusG} />
              </a>
            </div>
            <span>or use your email for registration</span>
            <input
              type="text"
              placeholder="Name"
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Username"
              value={signUpUsername}
              onChange={(e) => setSignUpUsername(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              required
            />
            {signUpError && <div className="error-message">{signUpError}</div>}
            {signUpSuccess && (
              <div className="success-message">{signUpSuccess}</div>
            )}
            <button type="submit" disabled={signUpLoading}>
              {signUpLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form onSubmit={handleSignInSubmit}>
            <h1>Sign in</h1>
            <div className="social-container">
              <a href="#" className="social" onClick={handleGoogleSignIn}>
                <FontAwesomeIcon icon={faGooglePlusG} />
              </a>
            </div>
            <span>or use your account</span>
            <input
              type="email"
              placeholder="Email"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
              required
            />
            <a href="#">Forgot your password?</a>
            {signInError && <div className="error-message">{signInError}</div>}
            <button type="submit" disabled={signInLoading}>
              {signInLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button
                className="ghost"
                id="signIn"
                onClick={handleSignInClick}
                type="button"
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button
                className="ghost"
                id="signUp"
                onClick={handleSignUpClick}
                type="button"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
