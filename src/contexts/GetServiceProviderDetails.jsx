import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { API_CONFIG } from "../config/constants";

const GetServiceProviderDetails = (uid, currentPrivatePage, currentBroadcastPage) => {
  const [serviceProviderDetails, setServiceProviderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getServiceProviderDetails = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("authToken");
      if (!token) throw new Error("No token found. Please log in again.");

      // Determine the page based on the active tab
      const page = currentPrivatePage ? currentPrivatePage : currentBroadcastPage;

      // Request to fetch service provider details with pagination
      const response = await fetch(
        `${API_CONFIG.baseURL}/admin/provider-details/${uid}?page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch service provider details");

      setServiceProviderDetails(data);  // Set the response data (service provider details)

    } catch (err) {
      console.error("Fetch Service Provider Details Error:", err);
      setError(err.message || "Error fetching service provider details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uid) {
      getServiceProviderDetails();  // Fetch data if UID is provided
    }
  }, [uid, currentPrivatePage, currentBroadcastPage]);  // Fetch new details whenever the UID or page changes

  return { serviceProviderDetails, loading, error, getServiceProviderDetails };
};

export default GetServiceProviderDetails;
