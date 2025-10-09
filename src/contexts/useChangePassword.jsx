import { useState } from "react";
import Cookies from "js-cookie";
import { API_CONFIG } from "../config/constants";

const useChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const changePassword = async (oldPassword, newPassword, confirmPassword) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match");
      setLoading(false);
      return;
    }

    try {
      const token = Cookies.get("authToken");
      if (!token) throw new Error("No token found. Please log in again.");

      const response = await fetch(`${API_CONFIG.baseURL}/admin/update-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      });

        if (!response.ok) {
        // Check if the response has a JSON body with error messages
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change the password");
      }

      const data = await response.json();
      setSuccess(true);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading, error, success };
};

export default useChangePassword;
