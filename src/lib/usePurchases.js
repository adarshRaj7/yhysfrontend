import { useState, useEffect, useCallback } from "react";
import { getUserPurchases } from "./purchaseApi";
import { useUser } from "../contexts/UserContext";

// Cache configuration
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const CACHE_KEY_PREFIX = "user_purchases_";
const CACHE_TIME_SUFFIX = "_time";

export function usePurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  // Generate user-specific cache keys
  const getCacheKey = useCallback(() => {
    return user ? `${CACHE_KEY_PREFIX}${user.uid}` : null;
  }, [user]);

  const getCacheTimeKey = useCallback(() => {
    return user ? `${CACHE_KEY_PREFIX}${user.uid}${CACHE_TIME_SUFFIX}` : null;
  }, [user]);

  // Check if cached data is still valid
  const isCacheValid = useCallback(() => {
    const cacheKey = getCacheKey();
    const timeKey = getCacheTimeKey();

    if (!cacheKey || !timeKey) return false;

    const cached = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(timeKey);

    if (!cached || !cacheTime) return false;

    const isExpired = Date.now() - parseInt(cacheTime) > CACHE_DURATION;
    return !isExpired;
  }, [getCacheKey, getCacheTimeKey]);

  // Get cached data
  const getCachedData = useCallback(() => {
    const cacheKey = getCacheKey();
    if (!cacheKey) return null;

    try {
      const cached = localStorage.getItem(cacheKey);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error("usePurchases: Error parsing cached data:", error);
      return null;
    }
  }, [getCacheKey]);

  // Cache data
  const cacheData = useCallback(
    (data) => {
      const cacheKey = getCacheKey();
      const timeKey = getCacheTimeKey();

      if (!cacheKey || !timeKey) return;

      try {
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(timeKey, Date.now().toString());
        console.log("usePurchases: Data cached successfully");
      } catch (error) {
        console.error("usePurchases: Error caching data:", error);
      }
    },
    [getCacheKey, getCacheTimeKey]
  );

  const fetchPurchases = useCallback(
    async (forceRefresh = false) => {
      if (!user) {
        console.log("usePurchases: No user found, clearing purchases");
        setPurchases([]);
        setLoading(false);
        return;
      }

      try {
        // Check cache first (unless force refresh)
        if (!forceRefresh && isCacheValid()) {
          const cachedData = getCachedData();
          if (cachedData) {
            console.log("usePurchases: Using cached data");
            setPurchases(cachedData);
            setLoading(false);
            return;
          }
        }

        console.log(
          "usePurchases: Fetching fresh purchases for user:",
          user.uid
        );
        setLoading(true);
        setError(null);

        const purchasesData = await getUserPurchases();
        console.log("usePurchases: Received purchases data:", purchasesData);

        const purchasesArray = purchasesData.purchases || [];
        console.log("usePurchases: Setting purchases array:", purchasesArray);

        setPurchases(purchasesArray);

        // Cache the fresh data
        cacheData(purchasesArray);
      } catch (err) {
        console.error("usePurchases: Error fetching purchases:", err);
        setError(err.toString());
        setPurchases([]);
      } finally {
        setLoading(false);
      }
    },
    [user, isCacheValid, getCachedData, cacheData]
  );

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  // Helper function to check if user has purchased a specific item
  const hasPurchased = useCallback(
    (itemId) => {
      if (!itemId || !purchases || purchases.length === 0) return false;
      return purchases.some((purchase) => purchase.itemId === itemId);
    },
    [purchases]
  );

  // Helper function to check if user has purchased the main product (yhys/Pre-Design Guide)
  const hasPurchasedMainProduct = useCallback(() => {
    return hasPurchased("EB25G001") || hasPurchased("yhys");
  }, [hasPurchased]);

  return {
    purchases,
    loading,
    error,
    hasPurchased,
    hasPurchasedMainProduct,
    refreshPurchases: () => fetchPurchases(true), // Force refresh
    refetchPurchases: fetchPurchases, // Keep for backward compatibility
  };
}
