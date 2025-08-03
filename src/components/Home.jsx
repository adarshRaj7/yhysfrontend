import Footer from "./Footer";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import React from "react";
import OrderPreviewModal from "./payment/OrderPreviewModal";
import PaymentResultModal from "./payment/PaymentResultModal";
import AlreadyPurchasedModal from "./payment/AlreadyPurchasedModal";
import usePayment from "./payment/usePayment";
import { usePurchases } from "../lib/usePurchases";

export default function Home({ onLoginClick }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const { hasPurchasedMainProduct, loading: purchasesLoading } = usePurchases();

  // This callback will be called when a purchase is completed
  const handlePurchaseComplete = () => {
    // Add a small delay to ensure verify request completes
    setTimeout(() => {
      console.log("Purchase completed successfully");
      // Could trigger a toast notification here if desired
      // For now, just let the dashboard handle the refresh when user navigates there
    }, 100);
  };

  // Add logging to buy now click
  const handleBuyNowClick = () => {
    console.log("BUY NOW button clicked!");
    console.log("handleBuyNow function:", handleBuyNow);
    console.log("user:", user);
    if (handleBuyNow) {
      handleBuyNow();
    } else {
      console.error("handleBuyNow is not defined!");
    }
  };

  const {
    orderPreview,
    orderCountdown,
    copied,
    paymentResult,
    handleBuyNow,
    setCopied,
    setPaymentResult,
    showAlreadyPurchasedModal,
    handleCloseModal,
    handleGoToDashboard,
  } = usePayment({
    user,
    onLoginClick,
    onPurchaseComplete: handlePurchaseComplete,
    navigate, // Pass navigate for better routing
  });

  return (
    <>
      <OrderPreviewModal
        orderPreview={orderPreview}
        orderCountdown={orderCountdown}
        copied={copied}
        setCopied={setCopied}
      />
      <PaymentResultModal
        paymentResult={paymentResult}
        setPaymentResult={setPaymentResult}
        navigate={navigate}
      />
      <AlreadyPurchasedModal
        isOpen={showAlreadyPurchasedModal}
        onClose={handleCloseModal}
        onGoToDashboard={handleGoToDashboard}
      />
      <div className="sky static-sky">
        <img src="/assets/home.png" alt="Static Sky" className="sky-image" />
      </div>
      <main className="hero-section">
        <div className="left-content">
          <div className="logo">
            <img
              src="/assets/logo.png"
              alt="Your Home Your Style Logo"
              className="main-logo"
            />
          </div>
          <p className="subheading">A Pre-Design Guide for Home Owners</p>
          <div className="buttons">
            <Link to="/about" className="btn">
              KNOW MORE
            </Link>
            {/* Show different buttons based on authentication and purchase status */}
            {!user ? (
              <button onClick={handleBuyNowClick} className="btn btn-primary">
                BUY NOW!
              </button>
            ) : purchasesLoading ? (
              <button className="btn btn-primary" disabled>
                Loading...
              </button>
            ) : hasPurchasedMainProduct() ? (
              <Link to="/dashboard" className="btn btn-success">
                VIEW IN DASHBOARD
              </Link>
            ) : (
              <button onClick={handleBuyNowClick} className="btn btn-primary">
                BUY NOW!
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
