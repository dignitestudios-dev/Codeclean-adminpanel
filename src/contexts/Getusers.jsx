// src/hooks/users/Getusers.js
import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { API_CONFIG } from "../config/constants";

const Getusers = (filters = {}, currentPage = 1, pageSize = 10) => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const [alltotaluser, setTotaluser] = useState();
  const [deactiveuser,setDeactiveuser] = useState();

  const getAllUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get("authToken");
      if (!token) throw new Error("No token found. Please log in again.");

      // 🔍 handle filters and pagination
      const queryParams = new URLSearchParams();
      queryParams.append("page", currentPage);
      queryParams.append("per_page", pageSize);
      if (filters.search) queryParams.append("search", filters.search);
      

      const response = await fetch(
        `${API_CONFIG.baseURL}/admin/users?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch users");

      // ✅ Extract API structure
      const usersList = data?.users?.data || [];
      const pagination = data?.users || {};
      const totaluser = data?.total_users || {};
      const noactiveusers = data?.deactivated_users || [];

      console.log(noactiveusers,"noactiveusers")

      setTotaluser(totaluser)
      setUsers(usersList);
      setTotalPages(pagination.last_page || 1);
      setTotalData(pagination.total || usersList.length);
      setDeactiveuser(noactiveusers);

      console.log("noactiveusers", noactiveusers);  // Log data to console
      

    } catch (err) {
      console.error("Fetch Users Error:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, pageSize]);

  useEffect(() => {
    getAllUsers();  // Fetch data whenever the dependencies change (filters, page, size)
  }, [getAllUsers]);

  return { users, totalPages,alltotaluser,deactiveuser, totalData, loading, getAllUsers };
};

export default Getusers;
