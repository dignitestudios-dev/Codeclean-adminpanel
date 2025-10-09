import { useState } from "react";
import Cookies from "js-cookie";
import { API_CONFIG } from "../config/constants";

const useMarkReportAsRead = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const markReportAsRead = async (reportId) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = Cookies.get("authToken");
      if (!token) throw new Error("No token found. Please log in again.");

      const response = await fetch(`${API_CONFIG.baseURL}/admin/reports/${reportId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to mark the report as read");

      const data = await response.json();
      setSuccess(true);  // Successfully marked as read
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { markReportAsRead, loading, error, success };
};

export default useMarkReportAsRead;
