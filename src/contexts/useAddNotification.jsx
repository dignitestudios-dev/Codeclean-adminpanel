import { useState } from "react";
import Cookies from "js-cookie";
import { API_CONFIG } from "../config/constants";

const useAddNotification = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Function to get the user's local timezone
    const getUserTimezone = () => {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    };

    // Helper function to format date as d-m-Y
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, "0"); // Add leading zero for single-digit days
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero for single-digit months
        const year = date.getFullYear();

        return `${day}-${month}-${year}`; // Return in d-m-Y format
    };

    const addNotification = async (title, body) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const token = Cookies.get("authToken");
            if (!token) throw new Error("No token found. Please log in again.");

            const notificationData = {
                title,
                date: formatDate(new Date()),  // Get current date (d-m-Y format)
                time: new Date().toLocaleTimeString("en-US", { hour12: false }), // Get current time (HH:mm:ss format)
                body,
                timezone: getUserTimezone(), // Get the system's timezone dynamically
            };

            const response = await fetch(`${API_CONFIG.baseURL}/admin/notifications`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(notificationData),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Failed to add notification");

            setSuccess(true);
        } catch (err) {
            console.error("Error adding notification:", err);
            setError(err.message || "Error adding notification.");
        } finally {
            setLoading(false);
        }
    };

    return {
        addNotification,
        loading,
        error,
        success,
    };
};

export default useAddNotification;
