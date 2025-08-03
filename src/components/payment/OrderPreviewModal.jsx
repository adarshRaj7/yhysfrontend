import React from "react";

export default function OrderPreviewModal({
  orderPreview,
  orderCountdown,
  copied,
  setCopied,
}) {
  if (!orderPreview) return null;
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
        <h2 style={{ marginBottom: 12 }}>Order Created!</h2>
        <p>Your Order ID:</p>
        <div
          className="order-id-box order-id-copyable"
          style={{
            fontWeight: "bold",
            fontSize: 20,
            background: "#f7f7f7",
            borderRadius: 8,
            padding: "12px 24px",
            margin: "10px 0 18px 0",
            letterSpacing: 1,
            cursor: "pointer",
            position: "relative",
            transition: "background 0.2s",
          }}
          title={copied ? "Copied!" : "Click to copy"}
          onClick={() => {
            if (orderPreview.orderId) {
              navigator.clipboard.writeText(orderPreview.orderId);
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            }
          }}
          onMouseLeave={() => setCopied(false)}
        >
          {orderPreview.orderId}
          {copied && (
            <span
              style={{
                position: "absolute",
                top: -28,
                left: "50%",
                transform: "translateX(-50%)",
                background: "#ef4f4f",
                color: "#fff",
                borderRadius: 6,
                padding: "2px 10px",
                fontSize: 13,
                fontWeight: 500,
                pointerEvents: "none",
                zIndex: 10,
                boxShadow: "0 2px 8px rgba(239,79,79,0.07)",
              }}
            >
              Copied!
            </span>
          )}
        </div>
        <p
          style={{
            color: "#ef4f4f",
            fontWeight: 500,
          }}
        >
          Payment will begin in {orderCountdown} second
          {orderCountdown !== 1 ? "s" : ""}...
        </p>
      </div>
    </div>
  );
}
