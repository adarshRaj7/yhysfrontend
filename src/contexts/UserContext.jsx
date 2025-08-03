import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Cookies from "js-cookie";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [manuallySet, setManuallySet] = useState(false); // Track if user was manually set

  const checkForCustomToken = useCallback(() => {
    const customToken =
      Cookies.get("authToken") || localStorage.getItem("authToken");

    if (customToken && !auth.currentUser) {
      const newUser = {
        uid: "custom-user",
        email: "custom-auth@user.com",
        displayName: "Custom User",
        isCustomAuth: true,
        getIdToken: async () => customToken,
      };
      setUser(newUser);
      setManuallySet(true);
      return true;
    } else if (!customToken && !auth.currentUser && !manuallySet) {
      setUser(null);
      return false;
    }
    return false;
  }, [manuallySet]);

  // Custom setUser function that tracks manual setting
  const setUserManually = (newUser) => {
    setUser(newUser);
    setManuallySet(true);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Firebase user is logged in
        setUser(firebaseUser);
        setLoading(false);
      } else {
        // No Firebase user, check for custom auth token
        checkForCustomToken();
        setLoading(false);
      }
    });

    // Check immediately on mount
    if (!auth.currentUser) {
      checkForCustomToken();
    }

    // Listen for cookie changes (storage events don't work for cookies, so we'll poll)
    const interval = setInterval(() => {
      if (!auth.currentUser && !manuallySet) {
        checkForCustomToken();
      }
    }, 5000); // Check every 5 seconds and only if not manually set

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [manuallySet, checkForCustomToken]); // Add checkForCustomToken as dependency

  return (
    <UserContext.Provider
      value={{ user, loading, setUser: setUserManually, checkForCustomToken }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
