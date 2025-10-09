import { useState } from "react";
import Cookies from "js-cookie";
import { API_CONFIG } from "../config/constants";

const useUserStatusToggle = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const updateUserStatus = async (userId, action) => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const token = Cookies.get("authToken");
      if (!token) throw new Error("No token found. Please log in again.");

      // ✅ Determine the correct endpoint
      let endpoint = "";
      if (action === "deactivate") {
        endpoint = `${API_CONFIG.baseURL}/admin/deactivate-user/${userId}`;
      } else if (action === "reactivate") {
        endpoint = `${API_CONFIG.baseURL}/admin/reactive-user/${userId}`;
      } else {
        throw new Error("Invalid action type. Use 'deactivate' or 'reactivate'.");
      }

      // 🔥 Send request
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Action failed.");

      setMessage(data.message || `User ${action}d successfully.`);
    } catch (err) {
      console.error("User status update error:", err);
      setError(err.message || "Error updating user status.");
    } finally {
      setLoading(false);
    }
  };

  return { updateUserStatus, loading, message, error };
};

export default useUserStatusToggle;
