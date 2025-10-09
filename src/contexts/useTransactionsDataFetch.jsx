import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { API_CONFIG } from "../config/constants";

const useTransactionsDataFetch = (currentPage = 1) => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alltotal, setAlltotal] = useState();

  const fetchTransactions = async (page = currentPage) => {
    setLoading(true);
    try {
      const token = Cookies.get("authToken");
      if (!token) throw new Error("No token found. Please log in again.");

      const response = await fetch(
        `${API_CONFIG.baseURL}/admin/withdrawals?page=${page}`,
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

      // Save transaction data and pagination
      setTransactions(data.data || []);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
      });
  setAlltotal(data.total);


    } catch (err) {
      console.error("Fetch Transactions Error:", err);
      setError(err.message || "Error fetching transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentPage]);


  return { transactions, pagination, alltotal, loading, error, fetchTransactions };
};

export default useTransactionsDataFetch;
