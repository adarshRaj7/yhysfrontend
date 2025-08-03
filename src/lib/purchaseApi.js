import axiosInstance from "./axiosInstance";
import Cookies from "js-cookie";

// Get user purchases
export const getUserPurchases = async () => {
  try {
    // Get token from cookie or localStorage
    const token = Cookies.get("authToken") || localStorage.getItem("authToken");

    if (!token) {
      throw new Error("No authentication token found");
    }

    console.log("getUserPurchases: Making API call to /orders/userpurchases");
    const response = await axiosInstance.get("/orders/userpurchases", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("getUserPurchases: API response:", response.data);

    // Transform the response to match frontend expectations
    const transformedData = {
      success: true,
      purchases:
        response.data.purchasedItems?.map((item, index) => ({
          id: `purchase_${item.itemId}_${index}`, // Generate unique ID
          itemId: item.itemId, // Add this for resend email functionality
          itemIds: [item.itemId],
          product: {
            name: item.name === "yhys" ? "Pre-Design Guide" : item.name,
            description:
              "A step-by-step guide for home owners to plan and style their dream space.",
            image: "/assets/services-image/eguides-and-your.jpg",
          },
          amount: item.price,
          currency: "INR",
          type: item.type,
          status: "completed",
          createdAt: new Date().toISOString(), // You might want to get this from backend
          isNew: false,
        })) || [],
    };

    console.log("getUserPurchases: Transformed data:", transformedData);
    return transformedData;
  } catch (error) {
    console.error("getUserPurchases: API error:", error);
    console.error("getUserPurchases: Error response:", error.response?.data);
    console.error("getUserPurchases: Error status:", error.response?.status);
    throw error.response?.data?.error || "Failed to fetch purchases";
  }
};

// Get purchase details by ID - for detailed view and re-downloads
export const getPurchaseDetails = async (purchaseId) => {
  try {
    const token = Cookies.get("authToken") || localStorage.getItem("authToken");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axiosInstance.get(`/userpurchases/${purchaseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to fetch purchase details";
  }
};

// Generate secure download link for a purchase
export const getDownloadLink = async (purchaseId) => {
  try {
    const token = Cookies.get("authToken") || localStorage.getItem("authToken");

    if (!token) {
      throw new Error("No authentication token found");
    }

    console.log(
      "getDownloadLink: Requesting download link for purchase:",
      purchaseId
    );
    const response = await axiosInstance.post(
      `/orders/download`, // Updated endpoint to match your structure
      {
        itemId: purchaseId, // Send the itemId (EB25G001) instead of purchase ID
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("getDownloadLink: Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("getDownloadLink: Error:", error);
    console.error("getDownloadLink: Error response:", error.response?.data);
    throw error.response?.data?.error || "Failed to generate download link";
  }
};

// Create a new purchase record after successful payment
export const createPurchase = async (itemIds, token = null) => {
  try {
    // Use provided token or fallback to stored token
    const authToken =
      token || Cookies.get("authToken") || localStorage.getItem("authToken");

    if (!authToken) {
      throw new Error("No authentication token found");
    }

    console.log("createPurchase: Making API call with itemIds:", itemIds);
    const response = await axiosInstance.post(
      "/orders/createpurchase",
      { itemIds }, // Send itemIds array
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    console.log("createPurchase: API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("createPurchase: API error:", error);
    console.error("createPurchase: Error response:", error.response?.data);
    console.error("createPurchase: Error status:", error.response?.status);
    throw error.response?.data?.error || "Failed to create purchase record";
  }
};

// Resend purchase confirmation email
export const resendPurchaseEmail = async (itemId) => {
  try {
    const token = Cookies.get("authToken") || localStorage.getItem("authToken");

    if (!token) {
      throw new Error("No authentication token found");
    }

    console.log("resendPurchaseEmail: Starting request");
    console.log("resendPurchaseEmail: Token exists:", !!token);
    console.log("resendPurchaseEmail: ItemId:", itemId);
    console.log("resendPurchaseEmail: ItemId type:", typeof itemId);

    if (!itemId || itemId === undefined) {
      throw new Error("ItemId is required for email resend");
    }

    const requestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 60000, // 60 second timeout for email operations
    };

    const requestBody = { itemId: itemId };

    console.log("resendPurchaseEmail: Request config:", requestConfig);
    console.log("resendPurchaseEmail: Request body:", requestBody);
    console.log("resendPurchaseEmail: Making request to /orders/resend-email");

    const response = await axiosInstance.post(
      `/orders/resend-email`,
      requestBody,
      requestConfig
    );

    console.log("resendPurchaseEmail: Response received:", response.data);
    return response.data;
  } catch (error) {
    console.error("resendPurchaseEmail: Error caught:", error);

    if (error.code === "ECONNABORTED") {
      console.error("resendPurchaseEmail: Request timeout");
      throw new Error(
        "Email sending is taking longer than expected. The email may still be processed. Please wait a few minutes before trying again."
      );
    }

    if (error.response) {
      console.error(
        "resendPurchaseEmail: Error response status:",
        error.response.status
      );
      console.error(
        "resendPurchaseEmail: Error response data:",
        error.response.data
      );
      console.error(
        "resendPurchaseEmail: Error response headers:",
        error.response.headers
      );
    } else if (error.request) {
      console.error(
        "resendPurchaseEmail: No response received:",
        error.request
      );
      throw new Error("No response from server. Please check your connection.");
    } else {
      console.error("resendPurchaseEmail: Request setup error:", error.message);
    }

    throw (
      error.response?.data?.error ||
      error.message ||
      "Failed to resend purchase email"
    );
  }
};
