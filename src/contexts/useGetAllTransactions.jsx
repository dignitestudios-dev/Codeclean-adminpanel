import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { API_CONFIG } from "../config/constants";

const useGetAllTransactions = (currentPage = 1) => {
  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({
    total_revenue: "0.00",
    pending_amount: "0.00",
    total_refunds: "0.00",
    processing_amount: "0.00",
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllTransactions = async (page = currentPage) => {
    setLoading(true);
    try {
      const token = Cookies.get("authToken");
      if (!token) throw new Error("No token found. Please log in again.");

      const response = await fetch(
        `${API_CONFIG.baseURL}/admin/transactions?page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch transactions.");

      // 🧩 Extract main values
      setTotals({
        total_revenue: data.total_revenue || "0.00",
        pending_amount: data.pending_amount || "0.00",
        total_refunds: data.total_refunds || "0.00",
        processing_amount: data.processing_amount || "0.00",
      });

      // 🧾 Transaction list
      setTransactions(data.transactions?.data || []);

      // 📄 Pagination
      setPagination({
        current_page: data.transactions?.current_page || 1,
        last_page: data.transactions?.last_page || 1,
        total: data.transactions?.total || 0,
      });

    } catch (err) {
      console.error("Fetch All Transactions Error:", err);
      setError(err.message || "Error fetching transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTransactions();
  }, [currentPage]);

  return {
    transactions,
    totals,
    pagination,
    loading,
    error,
    fetchAllTransactions,
  };
};

export default useGetAllTransactions;
