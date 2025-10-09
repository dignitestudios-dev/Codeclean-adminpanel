import { useState } from "react";
import { API_CONFIG } from "../config/constants";
import { useNavigate } from "react-router";

const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [responseData, setResponseData] = useState(null);
  const navigate = useNavigate();

  // Step 1: Send OTP to email (First time)
  const sendOtp = async (email) => {
    if (!email) {
      setError("Email is required");
      return { success: false };
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}/admin/resend-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.message || "Failed to send OTP";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      setSuccess(result.message || "OTP sent to your email!");
      setResponseData(result);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.message || "Something went wrong";
      setError(errorMessage);
      console.error("Send OTP Error:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const verifyOtp = async (email, otp) => {
    if (!email || !otp) {
      setError("Email and OTP are required");
      return { success: false };
    }

    if (otp.length < 4) {
      setError("OTP must be at least 4 digits");
      return { success: false };
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}/admin/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.message || "Invalid or expired OTP";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      setSuccess(result.message || "OTP verified successfully!");
      setResponseData(result);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.message || "OTP verification failed";
      setError(errorMessage);
      console.error("Verify OTP Error:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Update Password
  const updatePassword = async (password, password_confirmation) => {
    if (!password || !password_confirmation) {
      setError("Both password fields are required");
      return { success: false };
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return { success: false };
    }

    if (password !== password_confirmation) {
      setError("Passwords do not match");
      return { success: false };
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}/admin/update-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password, password_confirmation }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.message || "Failed to update password";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      setSuccess(result.message || "Password updated successfully!");
      setResponseData(result);

      // Save token if present
      if (result.token) {
        localStorage.setItem("authToken", result.token);
      }

      // Navigate to login or dashboard after delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);

      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.message || "Password update failed";
      setError(errorMessage);
      console.error("Update Password Error:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async (email) => {
    if (!email) {
      setError("Email is required");
      return { success: false };
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}/admin/resend-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.message || "Failed to resend OTP";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      setSuccess(result.message || "OTP resent to your email!");
      setResponseData(result);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.message || "Failed to resend OTP";
      setError(errorMessage);
      console.error("Resend OTP Error:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Clear messages
  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  // Reset hook
  const reset = () => {
    setLoading(false);
    setError("");
    setSuccess("");
    setResponseData(null);
  };

  return {
    sendOtp,
    verifyOtp,
    updatePassword,
    resendOtp,
    clearMessages,
    reset,
    loading,
    error,
    success,
    responseData,
  };
};

export default useForgotPassword;