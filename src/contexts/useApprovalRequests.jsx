import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { API_CONFIG } from "../config/constants";

const useApprovalRequests = (currentPage = 1) => {
  const [approvalRequests, setApprovalRequests] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Fetch approval requests
  const fetchApprovalRequests = async (page = currentPage) => {
    setLoading(true);
    try {
      const token = Cookies.get("authToken");
      if (!token) throw new Error("No token found. Please log in again.");

      const response = await fetch(
        `${API_CONFIG.baseURL}/admin/approval-requests?page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch approval requests.");

      // ✅ Set data and pagination
      setApprovalRequests(data.profile_requests?.data || []);
      setPagination({
        current_page: data.profile_requests?.current_page || 1,
        last_page: data.profile_requests?.last_page || 1,
        total: data.profile_requests?.total || 0,
      });
    } catch (err) {
      console.error("Fetch Approval Requests Error:", err);
      setError(err.message || "Error fetching approval requests.");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Automatically fetch on mount or when page changes
  useEffect(() => {
    fetchApprovalRequests();
  }, [currentPage]);

  return {
    approvalRequests,
    pagination,
    loading,
    error,
    fetchApprovalRequests,
  };
};

export default useApprovalRequests;
