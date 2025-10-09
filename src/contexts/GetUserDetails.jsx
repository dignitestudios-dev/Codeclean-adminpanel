import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { API_CONFIG } from "../config/constants";

const GetUserDetails = (uid, currentPrivatePage, currentBroadcastPage) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserDetails = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("authToken");
      if (!token) throw new Error("No token found. Please log in again.");

      // Determine the page based on the active tab
      const page = currentPrivatePage ? currentPrivatePage : currentBroadcastPage;

      // Request to fetch user details with pagination
      const response = await fetch(
        `${API_CONFIG.baseURL}/admin/user-details/${uid}?page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch user details");

      setUserDetails(data);  // Set the response data (user details)

    } catch (err) {
      console.error("Fetch User Details Error:", err);
      setError(err.message || "Error fetching user details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uid) {
      getUserDetails();  // Fetch data if UID is provided
    }
  }, [uid, currentPrivatePage, currentBroadcastPage]);  // Fetch new details whenever UID, currentPrivatePage, or currentBroadcastPage changes

  return { userDetails, loading, error, getUserDetails };
};

export default GetUserDetails;
