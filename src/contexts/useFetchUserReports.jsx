import { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { API_CONFIG } from "../config/constants";

const useFetchUserReports = (page = 1) => {
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = Cookies.get("authToken");
      if (!token) throw new Error("No token found. Please log in again.");

      const response = await fetch(`${API_CONFIG.baseURL}/admin/reports?page=${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch reports");

      const data = await response.json();
      setReports(data.data || []);
      setPagination({
        currentPage: data.current_page,
        lastPage: data.last_page,
        nextPageUrl: data.next_page_url,
        prevPageUrl: data.prev_page_url,
        total: data.total,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { reports, pagination, loading, error, refetch: fetchReports };
};

export default useFetchUserReports;
