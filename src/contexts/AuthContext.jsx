import React, { createContext, useContext, useState, useEffect } from "react";
import { API_CONFIG, APP_CONFIG, SECURITY_CONFIG } from "../config/constants";
import { handleError, handleSuccess } from "../utils/helpers";
import { api } from "../lib/services";
import Cookies from "js-cookie"; // ✅ install first: npm install js-cookie


const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAuthActions, setLoadingAuthActions] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);
  const [remainingLockTime, setRemainingLockTime] = useState(null);

  // Check if user is locked out
  const isLockedOut = () => {
    const lockedUntilCache = localStorage.getItem("lockedUntil");
    if (!lockedUntilCache) return false;
    return new Date() < new Date(lockedUntilCache);
  };

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = Cookies.get("authToken");
        const userData = Cookies.get("userData");

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        Cookies.remove("authToken");
        Cookies.remove("userData");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);


  // Login function
  // const login = async (email, password) => {
  //   if (isLockedOut()) {
  //     const remainingTime = Math.ceil(
  //       (new Date(lockedUntil) - new Date()) / 1000 / 60
  //     );
  //     return {
  //       success: false,
  //       error: `Account locked. Try again in ${remainingTime} minutes.`,
  //     };
  //   }

  //   setLoading(true);

  //   try {
  //     // Generate device information
  //     const deviceuniqueid = `device-${Date.now()}-${Math.floor(
  //       Math.random() * 10000
  //     )}`;
  //     const devicemodel = navigator.userAgent || "Unknown Device";

  //     // const response = await api.login({
  //     //   email,
  //     //   password,
  //     //   deviceuniqueid,
  //     //   devicemodel,
  //     // });

  //     const response = {
  //       data: {
  //         user: {
  //           name: "Admin",
  //           role: "admin"
  //         },
  //         token: "123123123",
  //       }
  //     }

  //     const userData = response?.data?.user;
  //     const token = response?.data?.token;

  //     // Store auth data
  //     localStorage.setItem("authToken", token);
  //     localStorage.setItem("userData", JSON.stringify(userData));

  //     setUser(userData);
  //     setLoginAttempts(0);
  //     localStorage.setItem("loginAttempts", 0);
  //     setLockedUntil(null);
  //     localStorage.setItem("lockedUntil", JSON.stringify(null));

  //     handleSuccess(response.message, "Login successful");
  //     return { success: true, user: userData };
  //   } catch (error) {
  //     let loginAttemptsCache = localStorage.getItem("loginAttempts");
  //     if (loginAttemptsCache) {
  //       loginAttemptsCache = parseInt(loginAttemptsCache, 10);
  //     }
  //     const newAttempts = loginAttemptsCache + 1;
  //     setLoginAttempts(newAttempts);
  //     localStorage.setItem("loginAttempts", newAttempts);

  //     if (newAttempts >= SECURITY_CONFIG.maxLoginAttempts) {
  //       const lockoutEnd = new Date(
  //         Date.now() + SECURITY_CONFIG.lockoutDuration
  //       );
  //       setLockedUntil(lockoutEnd.toISOString());
  //       localStorage.setItem("lockedUntil", lockoutEnd.toISOString());
  //       return {
  //         success: false,
  //         error: `Too many failed attempts. Account locked for ${SECURITY_CONFIG.lockoutDuration / 60000
  //           } minutes.`,
  //       };
  //     }

  //     handleError(error);
  //     return {
  //       success: false,
  //       error: `Invalid credentials. ${SECURITY_CONFIG.maxLoginAttempts - newAttempts
  //         } attempts remaining.`,
  //     };
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await fetch(`${API_CONFIG.baseURL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password");
      }


      const token = data?.token;
      const userData = data?.admin_details;

      if (!token) {
        throw new Error("No token received from server");
      }

      // ✅ Save token & user in cookies instead of localStorage
      Cookies.set("authToken", token, { expires: 7 }); // expires in 7 days
      Cookies.set("userData", JSON.stringify(userData), { expires: 7 });

      setUser(userData);

      handleSuccess("Login successful");
      return { success: true };
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, error: error.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  };
  // Logout function
  const logout = async () => {
    setLoading(true);

    try {
      // Clear auth data from localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      localStorage.setItem("loginAttempts", 0);
      setLoginAttempts(0);
      setLockedUntil(null);
      localStorage.setItem("lockedUntil", JSON.stringify(null));

      setUser(null);

      // Optionally redirect to login or home page
      window.location.href = "/auth/login"; // You can also use `useHistory` or `useNavigate` if you're using react-router

      handleSuccess("Logout successful");
      return { success: true };
    } catch (error) {
      handleError(error);
      return { success: false, error: "Logout failed." };
    } finally {
      setLoading(false);
    }
  };


  // Forgot password function
  const forgotPassword = async (payload) => {
    setLoadingAuthActions(true);
    try {
      const response = await api.forgotPassword(payload);
      return response.success;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setLoadingAuthActions(false);
    }
  };

  // Verify OTP function
  const verifyOTP = async (payload) => {
    setLoadingAuthActions(true);
    try {
      // Generate device information
      const deviceuniqueid = `device-${Date.now()}-${Math.floor(
        Math.random() * 10000
      )}`;
      const devicemodel = navigator.userAgent || "Unknown Device";

      const payloadWithHeaders = {
        ...payload,
        deviceuniqueid,
        devicemodel,
      };

      const response = await api.verifyOTP(payloadWithHeaders);
      const userData = response.data.user;
      const token = response.data.token;

      // Store auth data
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(userData));

      setUser(userData);
      handleSuccess(response.message, "OTP verified successfully");
      return { success: true };
    } catch (error) {
      handleError(error);
      return {
        success: false,
        error: error.message || "OTP verification failed.",
      };
    } finally {
      setLoadingAuthActions(false);
    }
  };

  // Update password function
  const updatePassword = async (payload) => {
    setLoadingAuthActions(true);
    try {
      const response = await api.updatePassword(payload);

      if (response.success) {
        handleSuccess(response.message, "Password updated successfully");
        return { success: true };
      } else {
        throw new Error(response.message || "Failed to update password.");
      }
    } catch (error) {
      handleError(error);
      return {
        success: false,
        error: error.message || "Failed to update password.",
      };
    } finally {
      setLoadingAuthActions(false);
    }
  };

  // Update password auth function
  const updatePasswordAuth = async (payload) => {
    setLoadingAuthActions(true);
    try {
      const response = await api.updatePasswordAuth(payload);

      if (response.success) {
        handleSuccess(response.message, "Password updated successfully");

        // Clear auth data
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");

        setUser(null);
        setLoginAttempts(0);
        localStorage.setItem("loginAttempts", 0);
        setLockedUntil(null);
        localStorage.setItem("lockedUntil", JSON.stringify(null));
        return { success: true };
      } else {
        throw new Error(response.message || "Failed to update password.");
      }
    } catch (error) {
      handleError(error);
      return {
        success: false,
        error: error.message || "Failed to update password.",
      };
    } finally {
      setLoadingAuthActions(false);
    }
  };

  // Register function
  const register = async (email, password, name) => {
    setLoading(true);
    try {
      const response = await api.register({ email, password, name });
      handleSuccess(response.message, "User registered successfully");
      return { success: true, user: response.data.user };
    } catch (error) {
      handleError(error);
      return { success: false, error: "Registration failed." };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLockedOut()) {
      const interval = setInterval(() => {
        const lockedUntilCache = localStorage.getItem("lockedUntil");
        if (lockedUntilCache) {
          const remainingTime = Math.max(
            new Date(lockedUntilCache) - new Date(),
            0
          );
          setRemainingLockTime(remainingTime);
          if (remainingTime === 0) {
            clearInterval(interval);
            setLockedUntil(null);
            setLoginAttempts(0);
            localStorage.removeItem("lockedUntil");
            localStorage.setItem("loginAttempts", "0");
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setRemainingLockTime(null);
    }
  }, [lockedUntil]);

  const value = {
    user,
    loading,
    loadingAuthActions,
    isAuthenticated: !!user,
    isLockedOut: isLockedOut(),
    loginAttempts,
    remainingLockTime,
    login,
    logout,
    forgotPassword,
    verifyOTP,
    updatePassword,
    updatePasswordAuth,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
