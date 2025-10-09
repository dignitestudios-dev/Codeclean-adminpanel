import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { API_CONFIG } from "../config/constants";

const useProviderDetails = (providerUid) => {
  const [providerDetails, setProviderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProviderDetails = async () => {
    if (!providerUid) return;

    setLoading(true);
    setError(null);

    try {
      const token = Cookies.get("authToken");
      if (!token) throw new Error("No token found. Please log in again.");

      const url = `${API_CONFIG.baseURL}/admin/provider-details/${providerUid}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch provider details.");

      setProviderDetails(data);
    } catch (err) {
      console.error("Provider Details Error:", err);
      setError(err.message || "Error fetching provider details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderDetails();
  }, [providerUid]);

  return { providerDetails, loading, error, fetchProviderDetails };
};

export default useProviderDetails;
