import { useState } from "react";
import Cookies from "js-cookie";
import { API_CONFIG } from "../config/constants";
import { useNavigate } from "react-router-dom";

/**
 * Custom Hook: useApproveRejectWithdrawal
 * Approves or rejects a specific withdrawal.
 * @param {string} withdrawalId - Unique ID of the withdrawal.
 */
const useApproveRejectWithdrawal = (withdrawalId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const approveWithdrawal = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get("authToken");
      if (!token) throw new Error("No token found. Please log in again.");

      const response = await fetch(
        `${API_CONFIG.baseURL}/admin/withdrawals/${withdrawalId}/approve`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to approve withdrawal.");
      navigate("/transactions")
      window.reload
    } catch (err) {
      console.error("Approve Withdrawal Error:", err);
      setError(err.message || "Error approving withdrawal.");
    } finally {
      setLoading(false);
    }
  };

  const rejectWithdrawal = async (reason) => {
    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get("authToken");
      if (!token) throw new Error("No token found. Please log in again.");

      const response = await fetch(
        `${API_CONFIG.baseURL}/admin/withdrawals/${withdrawalId}/reject`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: reason, // Send the reason in the request body
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to reject withdrawal.");

      alert("Withdrawal rejected successfully!");
    } catch (err) {
      console.error("Reject Withdrawal Error:", err);
      setError(err.message || "Error rejecting withdrawal.");
    } finally {
      setLoading(false);
    }
  };

  return { approveWithdrawal, rejectWithdrawal, loading, error };
};

export default useApproveRejectWithdrawal;
