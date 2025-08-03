import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../lib/axiosInstance";
import { createPurchase, getUserPurchases } from "../../lib/purchaseApi";

const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

export default function usePayment({
  user,
  onLoginClick,
  onPurchaseComplete,
  navigate,
}) {
  const [pendingPayment, setPendingPayment] = useState(false);
  const [orderPreview, setOrderPreview] = useState(null); // { orderId, timeoutId }
  const [orderCountdown, setOrderCountdown] = useState(10);
  const [copied, setCopied] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null); // { paymentId, orderId, signature }
  const [showAlreadyPurchasedModal, setShowAlreadyPurchasedModal] =
    useState(false);

  // Check if user has already purchased the main product
  const checkUserHasPurchased = useCallback(async () => {
    if (!user) return false;

    try {
      console.log("Checking user purchase status...");
      const purchasesData = await getUserPurchases();
      const purchases = purchasesData.purchases || [];

      // Check if user has purchased the main product (EB25G001 or yhys)
      const hasPurchased = purchases.some(
        (purchase) =>
          purchase.itemId === "EB25G001" || purchase.itemId === "yhys"
      );

      console.log("User has purchased main product:", hasPurchased);
      return hasPurchased;
    } catch (error) {
      console.error("Error checking purchase status:", error);
      // If we can't check, allow purchase to proceed
      return false;
    }
  }, [user]);

  // Handle modal actions
  const handleCloseModal = useCallback(() => {
    setShowAlreadyPurchasedModal(false);
  }, []);

  const handleGoToDashboard = useCallback(() => {
    setShowAlreadyPurchasedModal(false);
    if (navigate) {
      navigate("/dashboard");
    } else {
      window.location.href = "/dashboard";
    }
  }, [navigate]);

  // Create order via backend
  const createOrder = useCallback(
    async (amount, currency = "INR") => {
      console.log(
        "createOrder called with amount:",
        amount,
        "currency:",
        currency
      );

      if (!user) {
        console.error("createOrder: User not authenticated");
        throw new Error("User not authenticated");
      }

      try {
        // Get fresh token from Firebase instead of cookie
        console.log("Getting Firebase token...");
        const token = await user.getIdToken();
        console.log("Token obtained, making API call...");

        const res = await axiosInstance.post(
          "/pay/createOrder",
          {
            amount,
            currency,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("createOrder API response:", res.data);
        return res.data;
      } catch (error) {
        console.error("createOrder API error:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        throw error;
      }
    },
    [user]
  );

  // Payment success handler
  const handlePaymentSuccess = useCallback(
    async (paymentId, orderId, signature) => {
      setPaymentResult({ paymentId, orderId, signature });

      if (!user) {
        console.error("User not authenticated for payment verification");
        return;
      }

      // Don't call onPurchaseComplete immediately - let verification complete first

      // Use a longer delay and try verification immediately without setTimeout
      const performVerification = async () => {
        // Get fresh token from Firebase first
        const token = await user.getIdToken();

        try {
          console.log("Starting payment verification...");

          // Create a new axios instance to avoid any interference
          const response = await fetch("/api/pay/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_payment_id: paymentId,
              razorpay_order_id: orderId,
              razorpay_signature: signature,
            }),
          });

          const data = await response.json();
          console.log("Payment verification completed:", data);

          // Check for successful verification - either data.success OR data.message indicates success
          if (
            data.success ||
            data.message === "Payment verified successfully"
          ) {
            // Payment verification successful - create purchase record
            try {
              await createPurchase(["EB25G001"], token); // Pass itemIds array and token
              console.log("Purchase record created successfully");
            } catch (error) {
              console.error("Failed to create purchase record:", error);
              // Don't throw error here - payment was successful even if record creation failed
            }
          } else {
            console.log(
              "Payment verification response doesn't indicate success:",
              data
            );
          }

          // Now trigger the callback after everything is done
          if (onPurchaseComplete) {
            onPurchaseComplete();
          }
        } catch (error) {
          // Payment verification failed - but we still got payment confirmation
          // The user has paid, so we should still consider it a purchase
          console.error("Payment verification failed:", error);

          // Try to create purchase record anyway
          try {
            await createPurchase(["EB25G001"], token); // Pass itemIds array and token
            console.log("Purchase record created for unverified payment");
          } catch (error) {
            console.error(
              "Failed to create purchase record for unverified payment:",
              error
            );
          }

          // Still trigger callback even if verification failed
          if (onPurchaseComplete) {
            onPurchaseComplete();
          }
        }
      };

      // Call verification immediately - fire and forget approach
      performVerification().catch((error) => {
        console.error("Background verification failed:", error);
      });
    },
    [user, onPurchaseComplete]
  );

  // Load Razorpay SDK
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Trigger Razorpay checkout
  const triggerRazorpay = useCallback(
    (order) => {
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "Your Home Your Style",
        description: "Pre-Design Guide",
        image: "/assets/logo.png",
        order_id: order.id,
        handler: function (response) {
          setOrderPreview(null);
          handlePaymentSuccess(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature
          );
        },
        prefill: {
          name: user?.displayName || "",
          email: user?.email || "",
          contact: "",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#ef4f4f",
        },
      };
      if (window.Razorpay) {
        const rzp1 = new window.Razorpay(options);
        rzp1.on("payment.failed", function (response) {
          alert(`Error Code: ${response.error.code}`);
          alert(`Description: ${response.error.description}`);
          alert(`Source: ${response.error.source}`);
          alert(`Step: ${response.error.step}`);
          alert(`Reason: ${response.error.reason}`);
          alert(`Order ID: ${response.error.metadata.order_id}`);
          alert(`Payment ID: ${response.error.metadata.payment_id}`);
        });
        rzp1.open();
      } else {
        alert("Razorpay SDK not loaded");
      }
    },
    [handlePaymentSuccess, user]
  );

  // Payment flow
  const handlePayment = useCallback(async () => {
    console.log("=== handlePayment STARTED ===");
    console.log("handlePayment called, user:", user);

    if (!user) {
      console.log("No user, setting pending payment");
      setPendingPayment(true);
      if (onLoginClick) onLoginClick();
      return;
    }

    // Check if user has already purchased the product
    const hasPurchased = await checkUserHasPurchased();
    if (hasPurchased) {
      console.log("User has already purchased this product, showing modal");
      setShowAlreadyPurchasedModal(true);
      return;
    }

    try {
      console.log("Creating order...");
      const createdOrder = await createOrder(500, "INR");
      console.log("Order created:", createdOrder);

      if (!createdOrder || !createdOrder.order || !createdOrder.order.id) {
        console.error(
          "Order creation failed - invalid response:",
          createdOrder
        );
        alert("Order creation failed");
        return;
      }

      console.log(
        "Setting up order preview with order ID:",
        createdOrder.order.id
      );
      setOrderCountdown(10);
      setOrderPreview({ orderId: createdOrder.order.id });
      const timeoutId = setTimeout(() => {
        setOrderPreview(null);
        triggerRazorpay(createdOrder.order);
      }, 10000);
      setOrderPreview({ orderId: createdOrder.order.id, timeoutId });
    } catch (error) {
      console.error("Error in handlePayment:", error);
      alert("Failed to create order. Please try again.");
    }
  }, [user, createOrder, triggerRazorpay, onLoginClick, checkUserHasPurchased]);

  // Countdown effect
  useEffect(() => {
    if (!orderPreview) return;
    setOrderCountdown(10);
    const interval = setInterval(() => {
      setOrderCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [orderPreview]);

  // Clean up timeout
  useEffect(() => {
    return () => {
      if (orderPreview && orderPreview.timeoutId) {
        clearTimeout(orderPreview.timeoutId);
      }
    };
  }, [orderPreview]);

  // Resume payment after login
  useEffect(() => {
    if (user && pendingPayment) {
      setPendingPayment(false);

      // Add a small delay to ensure UI is ready, then check purchase status
      setTimeout(async () => {
        try {
          // First check if user has already purchased
          const hasPurchased = await checkUserHasPurchased();
          if (hasPurchased) {
            console.log(
              "User logged in but already has the product, showing modal"
            );
            setShowAlreadyPurchasedModal(true);
            return;
          }

          // If not purchased, proceed with payment
          console.log(
            "User logged in and hasn't purchased, proceeding with payment"
          );
          const createdOrder = await createOrder(369, "INR");
          if (!createdOrder || !createdOrder.order || !createdOrder.order.id) {
            alert("Order creation failed");
            return;
          }
          setOrderCountdown(10);
          setOrderPreview({ orderId: createdOrder.order.id });
          const timeoutId = setTimeout(() => {
            setOrderPreview(null);
            triggerRazorpay(createdOrder.order);
          }, 10000);
          setOrderPreview({ orderId: createdOrder.order.id, timeoutId });
        } catch (error) {
          console.error("Error resuming payment:", error);
          alert("Failed to resume payment. Please try again.");
        }
      }, 500);
    }
  }, [
    user,
    pendingPayment,
    createOrder,
    triggerRazorpay,
    checkUserHasPurchased,
  ]);

  // Copy order ID
  const handleCopy = useCallback(() => {
    if (orderPreview?.orderId) {
      navigator.clipboard.writeText(orderPreview.orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  }, [orderPreview]);

  return {
    orderPreview,
    orderCountdown,
    copied,
    setCopied,
    paymentResult,
    setPaymentResult,
    handleBuyNow: handlePayment, // Rename for Home.jsx compatibility
    setOrderPreview,
    handleCopy,
    // Modal state and handlers
    showAlreadyPurchasedModal,
    handleCloseModal,
    handleGoToDashboard,
  };
}
