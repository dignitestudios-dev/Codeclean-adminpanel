import Cookies from "js-cookie";
import { API_CONFIG } from "../config/constants";

export const getDashboardData = async () => {
  try {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No token found. Please log in again.");

    const response = await fetch(`${API_CONFIG.baseURL}/admin/dashboard`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch dashboard data.");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return { success: false, error: error.message };
  }
};
