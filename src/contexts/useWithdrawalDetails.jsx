import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { API_CONFIG } from "../config/constants";

const useWithdrawalDetails = (withdrawalId, currentPage = 1) => {
  const [withdrawalDetails, setWithdrawalDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useCallback se wrap kiya taake function reference stable rahe
  const getWithdrawalDetails = useCallback(async () => {
    if (!withdrawalId) return;
    
    setLoading(true);
    setError(null); // Error ko clear karo har fetch pe
    
    try {
      const token = Cookies.get("authToken");
      if (!token) throw new Error("No token found. Please log in again.");

      const response = await fetch(
        `${API_CONFIG.baseURL}/admin/withdrawals/${withdrawalId}?page=${currentPage}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch withdrawal details.");

      setWithdrawalDetails(data); // Full response with user, withdrawal info, and history
    } catch (err) {
      console.error("Fetch Withdrawal Details Error:", err);
      setError(err.message || "Error fetching withdrawal details.");
    } finally {
      setLoading(false);
    }
  }, [withdrawalId, currentPage]); // Dependencies add kiye

  useEffect(() => {
    if (withdrawalId) {
      getWithdrawalDetails();
    }
  }, [withdrawalId, currentPage, getWithdrawalDetails]); // getWithdrawalDetails ko dependency mein add kiya

  // refetch as an alias for better clarity
  return { 
    withdrawalDetails, 
    loading, 
    error, 
    refetch: getWithdrawalDetails, // Refetch function return kiya
    getWithdrawalDetails // Purana naam bhi rakha for backward compatibility
  };
};

export default useWithdrawalDetails;