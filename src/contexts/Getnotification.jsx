import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { API_CONFIG } from "../config/constants";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSendNotifications,setTotalSendNotifications] = useState();
  const [totalPendingNotifications,setTotalPendingNotifications] = useState();
  const [totalRecipients,setTotalRecipients] = useState();

  const getNotifications = useCallback(async (page) => {
    setLoading(true);
    try {
      const token = Cookies.get("authToken");
      if (!token) throw new Error("No token found. Please log in again.");

      const response = await fetch(
        `${API_CONFIG.baseURL}/admin/notifications?page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to fetch notifications");

      setNotifications(data.notifications.data); // Set notifications data
      setTotalPages(data.notifications.last_page); // Set total pages
      setTotalSendNotifications(data.total_send_notifications);
      setTotalPendingNotifications(data.total_pending_notifications);
      setTotalRecipients(data.total_recipients);
      

    } catch (err) {
      console.error("Fetch Notifications Error:", err);
      setError(err.message || "Error fetching notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getNotifications(currentPage); // Fetch notifications when currentPage changes
  }, [currentPage, getNotifications]);

  return {
    notifications,
    loading,
    error,
    totalPages,
    currentPage,
    setCurrentPage,
    totalSendNotifications,
    totalPendingNotifications,
    totalRecipients,
  };
};

export default useNotifications;
