import axiosInstance from "./axiosInstance";
import Cookies from "js-cookie";

export const signupUser = async (name, email, password, username) => {
  try {
    const response = await axiosInstance.post("/auth/signup", {
      name,
      email,
      password,
      username,
    });
    return response.data; // Return the response data
  } catch (error) {
    throw error.response?.data?.error || "An error occurred.";
  }
};
export const signinUser = async (email, password) => {
  try {
    const response = await axiosInstance.post("/auth/signin", {
      email,
      password,
    });
    // Store token in cookie
    if (response.data.token) {
      // Try multiple cookie setting strategies
      try {
        // Strategy 1: Most permissive settings for localhost development
        Cookies.set("authToken", response.data.token, {
          expires: 7,
          path: "/",
          sameSite: "lax",
          secure: false, // Allow non-HTTPS for localhost
          domain:
            window.location.hostname === "localhost" ? "localhost" : undefined,
        });
      } catch {
        // Strategy 2: Simple js-cookie without domain
        try {
          Cookies.set("authToken", response.data.token, {
            expires: 7,
            path: "/",
            sameSite: "lax",
          });
        } catch {
          // Strategy 3: Direct document.cookie as fallback
          const expires = new Date();
          expires.setDate(expires.getDate() + 7);
          document.cookie = `authToken=${
            response.data.token
          }; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
        }
      }

      // Delayed verification with localStorage fallback
      setTimeout(() => {
        const testCookie = Cookies.get("authToken");

        if (!testCookie) {
          // Fallback to localStorage
          try {
            localStorage.setItem("authToken", response.data.token);
          } catch {
            // If both cookie and localStorage fail, continue anyway
          }
        }
      }, 100);
    }
    return {
      ...response.data,
      token: response.data.token, // Make sure token is available in the response
    };
  } catch (error) {
    throw error.response?.data?.error || "An error occurred.";
  }
};
export const signOutUser = async () => {
  try {
    const response = await axiosInstance.post("/auth/signout");
    // Cookies.remove("authToken"); // Remove the token from cookies
    return response.data; // Return the response data
  } catch (error) {
    throw error.response?.data?.error || "An error occurred.";
  }
};

export const logoutUser = () => {
  Cookies.remove("authToken"); // Remove the token from cookies
  localStorage.removeItem("authToken"); // Also remove from localStorage
};
