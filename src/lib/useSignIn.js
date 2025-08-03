import { useState } from "react";
import { signinUser } from "./api";
import { useUser } from "../contexts/UserContext";
import Cookies from "js-cookie";

export function useSignIn(onLoginSuccess) {
  const [signInLoading, setSignInLoading] = useState(false);
  const [signInError, setSignInError] = useState("");
  const { checkForCustomToken, setUser } = useUser();

  const handleSignIn = async (email, password) => {
    setSignInLoading(true);
    setSignInError("");
    try {
      const result = await signinUser(email, password);

      // Use token from API response instead of cookie
      const token = result.token;

      // Immediately update the user context
      if (token && setUser) {
        const newUser = {
          uid: "custom-user",
          email: email, // Use the actual email from login
          displayName: result.user?.name || "Custom User", // Use actual name if available
          isCustomAuth: true,
          getIdToken: async () => token,
        };
        setUser(newUser);
      }

      // Also trigger the context check as backup (after a small delay to ensure cookie is set)
      if (checkForCustomToken) {
        setTimeout(() => checkForCustomToken(), 200);
      }

      if (onLoginSuccess) onLoginSuccess();
      return result;
    } catch (err) {
      setSignInError(err.toString());
    } finally {
      setSignInLoading(false);
    }
  };

  return { handleSignIn, signInLoading, signInError };
}
