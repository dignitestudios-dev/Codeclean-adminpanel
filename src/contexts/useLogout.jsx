import { useState } from "react";
import Cookies from "js-cookie";
import { API_CONFIG } from "../config/constants";
import { useNavigate } from "react-router";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = Cookies.get("authToken");
      if (!token) throw new Error("No token found. You are already logged out.");

      const response = await fetch(`${API_CONFIG.baseURL}/admin/logout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to logout");

      // On successful logout, remove the auth token
      Cookies.remove("authToken");

      setSuccess(true);

      // Navigate to the login page after successful logout
      navigate("/auth/login");
        window.location.reload();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading, error, success };
};

export default useLogout;
