import React, { useState } from 'react';
import { Search, Download, ChevronLeft, ChevronRight, TrendingUp, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import useTransactionsDataFetch from '../contexts/useTransactionsDataFetch';
import { IoEye } from 'react-icons/io5';
import { useNavigate } from 'react-router';

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { transactions, pagination, loading, error,alltotal, fetchTransactions } = useTransactionsDataFetch(page);

  const handleViewDetail = (id) => {
    navigate("/withdrawal-details", { state: { transactionId: id } });
  };

  console.log(alltotal, "alltotal")

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Filter transactions based on search and status
  const filteredTransactions = transactions ? transactions.filter(transaction => {
    const matchesSearch = transaction.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) : [];

  // Calculate stats from filtered transactions
  const totalAmount = filteredTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const paidCount = filteredTransactions.filter(t => t.status === 'paid').length;
  const rejectedCount = filteredTransactions.filter(t => t.status === 'rejected').length;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading transactions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Transactions</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => fetchTransactions()}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Withdrawal Transactions</h1>
          <p className="text-slate-600">Manage and monitor all withdrawal requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Total Transactions */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1 text-blue-100">Total Transactions</p>
                <p className="text-2xl font-bold">{alltotal}</p>
              </div>
              <div className="w-12 h-12 bg-blue-400/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1 text-emerald-100">Total Amount</p>
                <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-400/30 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Paid */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1 text-green-100">Paid</p>
                <p className="text-2xl font-bold">{paidCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-400/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Rejected */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1 text-red-100">Rejected</p>
                <p className="text-2xl font-bold">{rejectedCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-400/30 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>


        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-slate-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email or transaction ID..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <select
                className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="rejected">Rejected</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>


            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-slate-400 text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No Transactions Found</h3>
              <p className="text-slate-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">User</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Transaction ID</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Amount</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Date</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Status</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {transaction.user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{transaction.user.name}</p>
                              <p className="text-sm text-slate-500">{transaction.user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm font-mono text-slate-600">
                            {transaction.id.length > 20 ? `${transaction.id.slice(0, 20)}...` : transaction.id}
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-semibold text-slate-800">${parseFloat(transaction.amount).toFixed(2)}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm text-slate-600">{formatDate(transaction.created_at)}</p>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6 flex items-center justify-center mt-4">
                          <IoEye size={20} color='grey' className='cursor-pointer' onClick={() => handleViewDetail(transaction.id)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Page {pagination?.current_page || 1} of {pagination?.last_page || 1}
                  <span className="mx-2">•</span>
                  Showing {filteredTransactions.length} transactions
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    disabled={!pagination || pagination.current_page <= 1}
                    className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={!pagination || pagination.current_page >= pagination.last_page}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;