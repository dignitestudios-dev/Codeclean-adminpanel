import React, { useState } from 'react';
import { Search, Download, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, DollarSign, AlertCircle, Eye, X } from 'lucide-react';
import useGetAllTransactions from '../contexts/useGetAllTransactions';

const AllTransactionsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const { transactions, totals, pagination, loading, error, fetchAllTransactions } = useGetAllTransactions(page);

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

    const getTypeColor = (type) => {
        switch (type.toLowerCase()) {
            case 'payment':
                return 'bg-blue-100 text-blue-700';
            case 'refund':
                return 'bg-orange-100 text-orange-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-700';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'failed':
                return 'bg-red-100 text-red-700';
            case 'processing':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const handleViewDetails = (transaction) => {
        setSelectedTransaction(transaction);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedTransaction(null);
    };

    // Filter transactions
    const filteredTransactions = transactions ? transactions.filter(transaction => {
        const matchesSearch = transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.transaction_id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
    }) : [];

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
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Transactions</h3>
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={() => fetchAllTransactions()}
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
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">All Transactions</h1>
                    <p className="text-slate-600">Monitor payments and refunds across the platform</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                            <TrendingUp className="w-5 h-5 text-green-100" />
                        </div>
                        <p className="text-3xl font-bold">${totals?.total_revenue || '0.00'}</p>
                        <p className="text-green-100 text-xs mt-1">All time earnings</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-orange-100 text-sm font-medium">Total Refunds</p>
                            <TrendingDown className="w-5 h-5 text-orange-100" />
                        </div>
                        <p className="text-3xl font-bold">${totals?.total_refunds || '0.00'}</p>
                        <p className="text-orange-100 text-xs mt-1">Refunded amount</p>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-yellow-100 text-sm font-medium">Pending Amount</p>
                            <AlertCircle className="w-5 h-5 text-yellow-100" />
                        </div>
                        <p className="text-3xl font-bold">${totals?.pending_amount || '0.00'}</p>
                        <p className="text-yellow-100 text-xs mt-1">Awaiting confirmation</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-blue-100 text-sm font-medium">Processing</p>
                            <DollarSign className="w-5 h-5 text-blue-100" />
                        </div>
                        <p className="text-3xl font-bold">${totals?.processing_amount || '0.00'}</p>
                        <p className="text-blue-100 text-xs mt-1">In progress</p>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-slate-200">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by customer, email or transaction ID..."
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-3">
                            <select
                                className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="all">All Types</option>
                                <option value="payment">Payment</option>
                                <option value="refund">Refund</option>
                            </select>

                            <select
                                className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
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
                                            <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Transaction ID</th>
                                            <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Customer</th>
                                            <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Amount</th>
                                            <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Type</th>
                                            <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Status</th>
                                            <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Date</th>
                                            <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {filteredTransactions.map((transaction) => (
                                            <tr key={transaction.transaction_id} className="hover:bg-slate-50 transition-colors">
                                                <td className="py-4 px-6">
                                                    <p className="text-sm font-mono text-slate-600">
                                                        {transaction.transaction_id.length > 25
                                                            ? `${transaction.transaction_id.slice(0, 25)}...`
                                                            : transaction.transaction_id}
                                                    </p>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                            {transaction.customer.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-800">{transaction.customer}</p>
                                                            <p className="text-sm text-slate-500">{transaction.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <p className={`font-semibold ${transaction.type === 'refund' ? 'text-orange-600' : 'text-green-600'}`}>
                                                        {transaction.type === 'refund' ? '-' : '+'}${parseFloat(transaction.amount).toFixed(2)}
                                                    </p>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                                                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <p className="text-sm text-slate-600">{formatDate(transaction.date)}</p>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <button
                                                        onClick={() => handleViewDetails(transaction)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-slate-600">
                                    Page {pagination?.current_page || 1} of {pagination?.last_page || 1}
                                    <span className="mx-2">•</span>
                                    Showing {filteredTransactions.length} of {pagination?.total || 0} transactions
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

            {/* Transaction Details Modal */}
            {showModal && selectedTransaction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-blue-400 to-blue-400 text-white p-6 rounded-t-2xl flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold">Transaction Details</h2>
                                <p className="text-blue-100 text-sm mt-1">Complete transaction information</p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Customer Info */}
                            <div className="bg-slate-50 rounded-xl p-5">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-sm">👤</span>
                                    </div>
                                    Customer Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Name</p>
                                        <p className="font-medium text-slate-800">{selectedTransaction.customer}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Email</p>
                                        <p className="font-medium text-slate-800">{selectedTransaction.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Transaction Info */}
                            <div className="bg-slate-50 rounded-xl p-5">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                        <DollarSign className="w-4 h-4 text-white" />
                                    </div>
                                    Transaction Information
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Transaction ID</p>
                                        <p className="font-mono text-sm bg-white p-3 rounded-lg border border-slate-200 break-all">
                                            {selectedTransaction.transaction_id}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1">Amount</p>
                                            <p className={`text-2xl font-bold ${selectedTransaction.type === 'refund' ? 'text-orange-600' : 'text-green-600'}`}>
                                                {selectedTransaction.type === 'refund' ? '-' : '+'}${parseFloat(selectedTransaction.amount).toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1">Date & Time</p>
                                            <p className="font-medium text-slate-800">{formatDate(selectedTransaction.date)}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-slate-500 mb-2">Type</p>
                                            <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${getTypeColor(selectedTransaction.type)}`}>
                                                {selectedTransaction.type.charAt(0).toUpperCase() + selectedTransaction.type.slice(1)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 mb-2">Status</p>
                                            <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${getStatusColor(selectedTransaction.status)}`}>
                                                {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info - if available */}
                            {selectedTransaction.description && (
                                <div className="bg-slate-50 rounded-xl p-5">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Description</h3>
                                    <p className="text-slate-600">{selectedTransaction.description}</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 bg-slate-50 rounded-b-2xl border-t border-slate-200">
                            <button
                                onClick={closeModal}
                                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllTransactionsPage;