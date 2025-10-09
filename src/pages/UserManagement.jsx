import React, { useState } from 'react';
import { Search, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import Getusers from '../contexts/Getusers';
import { FaEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const [filters, setFilters] = useState({ search: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const { users, totalPages, totalData, alltotaluser, deactiveuser, loading } = Getusers(filters, currentPage, 10);
  
  const navigate = useNavigate();

  console.log(deactiveuser,"deactiveuser")

  const handleSearchChange = (e) => {
    setFilters({ search: e.target.value });
    setCurrentPage(1);
    console.log("Search filter value:", e.target.value);
  };

const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return "No Phone Number";

  const cleanedNumber = phoneNumber.replace(/\D/g, "");

  if (cleanedNumber.length === 10) {
    return `+1 ${cleanedNumber.slice(0, 3)}-${cleanedNumber.slice(3, 6)}-${cleanedNumber.slice(6)}`;
  }

  return "+1 " + cleanedNumber;
};

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      'Admin': 'bg-purple-100 text-purple-700 border-purple-200',
      'Manager': 'bg-blue-100 text-blue-700 border-blue-200',
      'User': 'bg-green-100 text-green-700 border-green-200',
      'user': 'bg-green-100 text-green-700 border-green-200',
      'service_provider': 'bg-blue-100 text-blue-700 border-blue-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  // Ensure users is always an array
  const safeUsers = Array.isArray(users) ? users : [];
  const safeTotalPages = typeof totalPages === 'number' ? totalPages : 0;
  const safeTotalData = typeof totalData === 'number' ? totalData : 0;
  const safeAlltotaluser = typeof alltotaluser === 'number' ? alltotaluser : 0;
  const safeDeactiveuser = typeof deactiveuser === 'number' ? deactiveuser : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              User Management
            </h1>
          </div>
          <p className="text-gray-600 ml-14">Manage and monitor all users in your system</p>
        </div>

        {/* Stats and Search Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Stats */}
            <div className="flex gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Users</p>
                  <p className="text-[20px] font-bold text-gray-800">{safeAlltotaluser}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Activate Users</p>
                  <p className="text-[20px] font-bold text-gray-800">{safeAlltotaluser - safeDeactiveuser}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Deactivated Users</p>
                  <p className="text-[20px] font-bold text-gray-800">{safeDeactiveuser}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 rounded-xl">
                  <div className="w-5 h-5 text-indigo-600 font-bold flex items-center justify-center">
                    {safeTotalPages}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Pages</p>
                  <p className="text-[20px] font-bold text-gray-800">{safeTotalPages}</p>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={handleSearchChange}
                placeholder="Search users by name or email..."
                className="pl-12 pr-4 py-3 w-full md:w-80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading users...</p>
          </div>
        ) : (
          <>
            {/* User Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      <th className="px-6 py-4 text-left text-sm font-semibold">User</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Phone Number</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Joined Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeUsers.length > 0 ? (
                      safeUsers.map((user, index) => (
                        <tr
                          key={user?.id || index}
                          className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <img
                                  src={user?.avatar && typeof user.avatar === 'string' ? `https://code-clean-bucket.s3.us-east-2.amazonaws.com/${user.avatar}` : 'https://i.pinimg.com/280x280_RS/e1/08/21/e10821c74b533d465ba888ea66daa30f.jpg'}
                                  alt={user?.name || "No Name"}
                                  className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-100"
                                />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">{user?.name || "No Name"}</p>
                                <p className="text-xs text-gray-500">ID: {user?.id || 'N/A'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-gray-700">{user?.email || "No Email"}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center capitalize px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(user?.role)}`}>
                              {user?.role || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-gray-700">{formatPhoneNumber(user?.phone_number)}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-gray-700">{user?.joined_date || "No Date"}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className={`text-[12px] p-1 rounded-xl flex items-center justify-center pl-[3px] pr-[3px] ${user?.is_deactivate === true ? 'bg-red-300 text-red-700' : 'bg-green-300 text-green-700'}`}>
                              {user?.is_deactivate === true ? 'In-Active' : 'Active'}
                            </p>
                          </td>
                          <td
                            onClick={() => {
                              if (user?.role === "user") {
                                navigate(`/user-details/${user.uid}`);
                              } else if (user?.role === "service_provider") {
                                navigate(`/serviceprovider-details/${user.uid}`);
                              }
                            }}
                            className="px-6 py-4 cursor-pointer flex justify-center items-center pt-8"
                          >
                            <FaEye />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-gray-800">{(currentPage - 1) * 15 + 1}</span> to{' '}
                    <span className="font-semibold text-gray-800">{Math.min(currentPage * 15, safeTotalData)}</span> of{' '}
                    <span className="font-semibold text-gray-800">{safeTotalData}</span> users
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {safeTotalPages > 0 && [...Array(safeTotalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${currentPage === i + 1
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === safeTotalPages}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserManagement;