import React from "react";

export default function PaymentResultModal({
  paymentResult,
  setPaymentResult,
  navigate,
}) {
  if (!paymentResult) return null;

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{
          minWidth: 400,
          minHeight: 220,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2 style={{ marginBottom: 12, color: "#2e7d32" }}>
          Payment Successful!
        </h2>
        <div style={{ marginBottom: 10 }}>Payment ID:</div>
        <div className="order-id-box" style={{ marginBottom: 18 }}>
          {paymentResult.paymentId}
        </div>
        <div style={{ marginBottom: 10 }}>Order ID:</div>
        <div className="order-id-box" style={{ marginBottom: 18 }}>
          {paymentResult.orderId}
        </div>
        <button
          className="btn btn-primary"
          style={{ marginTop: 10 }}
          onClick={() => {
            // Add a small delay to allow verification to complete
            setTimeout(() => {
              setPaymentResult(null);
              navigate("/dashboard");
            }, 500);
          }}
        >
          My Dashboard
        </button>
      </div>
    </div>
  );
}
