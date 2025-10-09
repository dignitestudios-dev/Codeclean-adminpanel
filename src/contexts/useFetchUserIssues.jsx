import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { API_CONFIG } from "../config/constants";

const useFetchUserIssues = (page = 1) => {
  const [reports, setReports] = useState([]); // List of reports
  const [pagination, setPagination] = useState({}); // Pagination info
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Function to fetch reports
  const fetchReports = useCallback(async () => {
    setLoading(true); // Set loading to true when fetching
    setError(null); // Reset any previous errors

    try {
      const token = Cookies.get("authToken"); // Get the auth token
      if (!token) throw new Error("No token found. Please log in again."); // If no token, throw error

      // Make the fetch request to the API with the page number
      const response = await fetch(`${API_CONFIG.baseURL}/admin/user/issues?page=${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch reports");

      // Parse the response JSON
      const data = await response.json();

      // Set the reports and pagination
      setReports(data.data || []);
      setPagination({
        currentPage: data.current_page,
        lastPage: data.last_page,
        total: data.total,
        nextPageUrl: data.next_page_url,
        prevPageUrl: data.prev_page_url,
      });
    } catch (err) {
      setError(err.message); // If an error occurs, set error message
    } finally {
      setLoading(false); // Set loading to false after fetch is complete
    }
  }, [page]); // Re-run fetch when page changes

  // Trigger fetching whenever the page changes
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Return the reports, pagination, loading, error, and refetch function
  return { reports, pagination, loading, error, refetch: fetchReports };
};

export default useFetchUserIssues;
