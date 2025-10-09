import { useState } from "react";
import Cookies from "js-cookie";
import { API_CONFIG } from "../config/constants";

const useMarkIssueAsRead = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");  // For storing success/error messages

  const markIssueAsRead = async (issueId) => {
    setLoading(true);  // Set loading to true when initiating request
    setError(null);  // Reset error
    setSuccess(false);  // Reset success state
    setMessage("");  // Reset message state

    try {
      const token = Cookies.get("authToken");
      if (!token) throw new Error("No token found. Please log in again.");

      // Make the API request to mark the issue as read
      const response = await fetch(`${API_CONFIG.baseURL}/admin/issues/${issueId}`, {
        method: "POST",  // Changed to PUT
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to mark issue as read");

      const data = await response.json();
      
      // If the operation is successful, set the success state and message
      setSuccess(true);
      setMessage(data.message || "Issue marked as read successfully.");  // Set success message
      return data;

    } catch (err) {
      // If there was an error, set the error state and message
      setError(err.message);
      setMessage(err.message);  // Set the error message
    } finally {
      setLoading(false);  // Set loading to false after request completion
    }
  };

  return { markIssueAsRead, loading, error, success, message };  // Return message along with success/error states
};

export default useMarkIssueAsRead;
