import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./Dashboard.css";
import "./Services.css";
import { useLocation, useNavigate } from "react-router-dom";
import { usePurchases } from "../lib/usePurchases";
import { getDownloadLink, resendPurchaseEmail } from "../lib/purchaseApi";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import Cookies from "js-cookie";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { purchases, loading, error, refreshPurchases } = usePurchases();
  const [downloadingId, setDownloadingId] = useState(null);
  const [resendingId, setResendingId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle secure download
  const handleDownload = async (itemId, productName) => {
    try {
      setDownloadingId(itemId);
      console.log("handleDownload: Starting download for itemId:", itemId);
      const downloadData = await getDownloadLink(itemId);

      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = downloadData.downloadUrl;
      link.download = `${productName}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("handleDownload: Download initiated successfully");
    } catch (error) {
      console.error("handleDownload: Download failed:", error);
      alert("Failed to download file. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  // Handle resend purchase email
  const handleResendEmail = async (itemId, productName) => {
    try {
      console.log("handleResendEmail: Starting function");
      console.log("handleResendEmail: itemId received:", itemId);
      console.log("handleResendEmail: productName received:", productName);

      if (!itemId) {
        console.error("handleResendEmail: No itemId provided");
        alert(
          "Error: No item ID found. Please refresh the page and try again."
        );
        return;
      }

      setResendingId(itemId);
      console.log("handleResendEmail: About to call resendPurchaseEmail API");

      const result = await resendPurchaseEmail(itemId);

      console.log("handleResendEmail: API call successful:", result);
      console.log("handleResendEmail: Email resent successfully");
    } catch (error) {
      console.error("handleResendEmail: Failed to resend email:", error);
      console.error("handleResendEmail: Error type:", typeof error);
      console.error("handleResendEmail: Error message:", error.message);
    } finally {
      setResendingId(null);
      console.log("handleResendEmail: Function completed");
    }
  };

  // Handle refresh with animation
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshPurchases();
    } finally {
      // Keep animation for at least 500ms for visual feedback
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Logout handler: clear tokens and redirect
  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);

      // Clear tokens
      Cookies.remove("authToken");
      localStorage.removeItem("authToken");

      navigate("/");
      window.location.reload();
    } catch {
      // Even if Firebase signout fails, clear tokens and reload
      Cookies.remove("authToken");
      localStorage.removeItem("authToken");
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <div className="aceternity-dashboard">
      <Sidebar onLogout={handleLogout} activePath={location.pathname} />
      <main className="dashboard-content">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "30px 0 18px 0",
          }}
        >
          <h2 style={{ color: "#4d2f2b", margin: 0 }}>My Purchases</h2>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{
              padding: "8px",
              backgroundColor: "transparent",
              color: "#ef4f4f",
              border: "2px solid #ef4f4f",
              borderRadius: "6px",
              cursor: isRefreshing ? "not-allowed" : "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              transition: "all 0.2s ease",
              opacity: isRefreshing ? 0.7 : 1,
            }}
            title="Refresh purchases"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                animation: isRefreshing ? "spin 1s linear infinite" : "none",
              }}
            >
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="m20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
          </button>
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
            Loading your purchases...
          </div>
        ) : error ? (
          <div
            style={{ padding: "40px", textAlign: "center", color: "#e74c3c" }}
          >
            Error loading purchases: {error}
          </div>
        ) : purchases.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
            <h3 style={{ marginBottom: "16px" }}>No purchases yet</h3>
            <p>When you purchase products, they will appear here.</p>
            <button
              onClick={() => navigate("/services")}
              style={{
                marginTop: "20px",
                padding: "12px 24px",
                backgroundColor: "#ef4f4f",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div
            className="services-gallery"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "24px",
              width: "100%",
            }}
          >
            {purchases.map((purchase, idx) => (
              <div
                className="service-item"
                key={purchase.id || idx}
                style={{
                  aspectRatio: "1 / 1.15",
                  maxWidth: 340,
                  width: "100%",
                }}
              >
                <div
                  className="service-image"
                  style={{
                    backgroundImage: `url(${
                      purchase.product?.image ||
                      "/assets/services-image/eguides-and-your.jpg"
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "100%",
                    height: "100%",
                    borderRadius: "16px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {purchase.isNew && <span className="service-badge">New</span>}
                  <div className="service-overlay">
                    <div className="service-content">
                      <h3>{purchase.product?.name || "Pre-Design Guide"}</h3>
                      <p>
                        {purchase.product?.description ||
                          "A step-by-step guide for home owners to plan and style their dream space."}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          alignItems: "flex-start",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            opacity: 0.9,
                            color: "#ffffff",
                            textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
                            fontWeight: "500",
                          }}
                        >
                          Purchased:{" "}
                          {new Date(purchase.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() =>
                            handleDownload(
                              purchase.itemId,
                              purchase.product?.name || "Pre-Design Guide"
                            )
                          }
                          className="service-duration"
                          disabled={downloadingId === purchase.itemId}
                          style={{
                            color: "#ffffff",
                            textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
                            textDecoration: "none",
                            backgroundColor: "rgba(255,255,255,0.2)",
                            padding: "8px 16px",
                            borderRadius: "20px",
                            fontSize: "14px",
                            fontWeight: "600",
                            border: "none",
                            cursor:
                              downloadingId === purchase.itemId
                                ? "not-allowed"
                                : "pointer",
                            opacity:
                              downloadingId === purchase.itemId ? 0.6 : 1,
                          }}
                        >
                          {downloadingId === purchase.itemId
                            ? "Downloading..."
                            : "Download"}
                        </button>
                        <button
                          onClick={() =>
                            handleResendEmail(
                              purchase.itemId,
                              purchase.product?.name || "Pre-Design Guide"
                            )
                          }
                          className="service-duration"
                          disabled={resendingId === purchase.itemId}
                          style={{
                            color: "#ffffff",
                            textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
                            textDecoration: "none",
                            backgroundColor: "rgba(239, 79, 79, 0.2)",
                            padding: "8px 16px",
                            borderRadius: "20px",
                            fontSize: "14px",
                            fontWeight: "600",
                            border: "none",
                            cursor:
                              resendingId === purchase.itemId
                                ? "not-allowed"
                                : "pointer",
                            opacity: resendingId === purchase.itemId ? 0.6 : 1,
                          }}
                        >
                          {resendingId === purchase.itemId
                            ? "Sending Email..."
                            : "Resend Email"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
