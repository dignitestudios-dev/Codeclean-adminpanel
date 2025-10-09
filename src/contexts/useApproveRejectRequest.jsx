import { useState } from "react";
import Cookies from "js-cookie";
import { API_CONFIG } from "../config/constants";

const useApproveRejectRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 🔹 Approve Request
  const approveRequest = async (requestId) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = Cookies.get("authToken");
      if (!token) throw new Error("No token found. Please log in again.");

      const response = await fetch(
        `${API_CONFIG.baseURL}/admin/profile-approval-requests/${requestId}/approve`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to approve the request.");

      setSuccess(data.message || "Request approved successfully!");
      return data;
    } catch (err) {
      console.error("Approve Request Error:", err);
      setError(err.message || "Something went wrong while approving request.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Reject Request with reason
  const rejectRequest = async (requestId, reason) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = Cookies.get("authToken");
      if (!token) throw new Error("No token found. Please log in again.");

      const response = await fetch(
        `${API_CONFIG.baseURL}/admin/profile-approval-requests/${requestId}/reject`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason }), // ✅ sending rejection reason
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to reject the request.");

      setSuccess(data.message || "Request rejected successfully!");
      return data;
    } catch (err) {
      console.error("Reject Request Error:", err);
      setError(err.message || "Something went wrong while rejecting request.");
    } finally {
      setLoading(false);
    }
  };

  return {
    approveRequest,
    rejectRequest,
    loading,
    error,
    success,
  };
};

export default useApproveRejectRequest;
