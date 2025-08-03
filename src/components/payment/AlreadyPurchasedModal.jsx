import React from "react";
import "./AlreadyPurchasedModal.css";

export default function AlreadyPurchasedModal({
  isOpen,
  onClose,
  onGoToDashboard,
}) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="already-purchased-modal-backdrop"
      onClick={handleBackdropClick}
    >
      <div className="already-purchased-modal">
        <div className="already-purchased-modal-header">
          <h2>Product Already Purchased</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="already-purchased-modal-body">
          <div className="already-purchased-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <p>
            You have already purchased this product! You can access it from your
            dashboard.
          </p>
        </div>

        <div className="already-purchased-modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Stay Here
          </button>
          <button className="btn btn-primary" onClick={onGoToDashboard}>
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
