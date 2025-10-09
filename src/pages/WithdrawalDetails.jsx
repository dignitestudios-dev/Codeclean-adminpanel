import React, { useState } from "react";
import { DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Check, X, ChevronLeft } from "lucide-react";
import useWithdrawalDetails from "../contexts/useWithdrawalDetails";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import useApproveRejectWithdrawal from "../contexts/useApproveRejectWithdrawal";

const WithdrawalDetails = () => {
    const [page, setPage] = useState(1);
    const [reason, setReason] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { transactionId } = location.state || {};
    const { withdrawalDetails, loading, error, refetch } = useWithdrawalDetails(
        transactionId,
        page
    );

    const { approveWithdrawal, rejectWithdrawal, loading: actionLoading, error: actionError } = useApproveRejectWithdrawal(transactionId);

    console.log(transactionId, "transactionId");

    const handleApprove = async () => {
        const success = await approveWithdrawal();
        if (success) {
            await refetch(); // Real-time update
        }
    };

    const handleRejectClick = () => {
        setShowRejectModal(true);
    };

    const handleRejectConfirm = async () => {
        if (!reason.trim()) {
            alert("Please provide a reason for rejection");
            return;
        }
        const success = await rejectWithdrawal(reason);
        if (success) {
            setShowRejectModal(false);
            setReason("");
            await refetch(); // Real-time update
           
        }
    };

    const handleRejectCancel = () => {
        setShowRejectModal(false);
        setReason("");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Loading withdrawal details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-center text-slate-700">Error: {error}</p>
                </div>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            paid: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle, label: "Paid" },
            pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock, label: "Pending" },
            rejected: { bg: "bg-red-100", text: "text-red-700", icon: XCircle, label: "Rejected" },
            failed: { bg: "bg-red-100", text: "text-red-700", icon: XCircle, label: "failed" },
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
                <Icon className="w-4 h-4" />
                {config.label}
            </span>
        );
    };

    const totalAmount = withdrawalDetails.history?.data?.reduce((sum, item) => sum + parseFloat(item.amount), 0) || 0;
    const paidAmount = withdrawalDetails.history?.data?.filter(item => item.status === 'paid').reduce((sum, item) => sum + parseFloat(item.amount), 0) || 0;
    const pendingAmount = withdrawalDetails.history?.data?.filter(item => item.status === 'pending').reduce((sum, item) => sum + parseFloat(item.amount), 0) || 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-start">
                    <div>
                        <ChevronLeft onClick={() => {
                            navigate(-1)
                        }} className="cursor-pointer pt-3" size={40} />
                    </div>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">Withdrawal Details</h1>
                        <p className="text-slate-600">Track and manage all withdrawal requests</p>
                    </div>
                </div>

                {/* Action Error Display */}
                {actionError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <p className="text-red-700">{actionError}</p>
                    </div>
                )}

                {/* Current Withdrawal Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-slate-200">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 mb-1">Current Withdrawal</h2>
                            <p className="text-sm text-slate-500">{withdrawalDetails.request_date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {withdrawalDetails.status === "pending" && (
                                <>
                                    <button
                                        onClick={handleApprove}
                                        disabled={actionLoading}
                                        className="flex items-center gap-2 rounded-3xl bg-green-600 hover:bg-green-700 text-white px-4 py-2 font-medium transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {actionLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Approving...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-4 h-4" />
                                                Approve
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleRejectClick}
                                        disabled={actionLoading}
                                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-3xl font-medium transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <X className="w-4 h-4" />
                                        Reject
                                    </button>
                                </>
                            )}
                            {getStatusBadge(withdrawalDetails.status)}
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-6 h-6" />
                            <span className="text-sm font-medium opacity-90">Withdrawal Amount</span>
                        </div>
                        <p className="text-4xl font-bold">${parseFloat(withdrawalDetails.amount).toFixed(2)}</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-5 border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Total Withdrawals</p>
                                <p className="text-2xl font-bold text-slate-800">${totalAmount.toFixed(2)}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <DollarSign className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-5 border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Paid Amount</p>
                                <p className="text-2xl font-bold text-green-600">${paidAmount.toFixed(2)}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-5 border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Pending Amount</p>
                                <p className="text-2xl font-bold text-yellow-600">${pendingAmount.toFixed(2)}</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-lg">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Withdrawal History */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                        <h3 className="text-xl font-semibold text-slate-800">Withdrawal History</h3>
                        <p className="text-sm text-slate-600 mt-1">Complete list of all withdrawal transactions</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {withdrawalDetails.history?.data?.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                                            {item.request_date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-semibold text-slate-800">
                                                ${parseFloat(item.amount).toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(item.status)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Rejection Reason Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-red-100 p-2 rounded-lg">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800">Rejection Reason</h3>
                        </div>

                        <p className="text-sm text-slate-600 mb-4">
                            Please provide a reason for rejecting this withdrawal request.
                        </p>

                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                            rows="4"
                            disabled={actionLoading}
                        />

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleRejectCancel}
                                disabled={actionLoading}
                                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRejectConfirm}
                                disabled={actionLoading || !reason.trim()}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {actionLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Rejecting...
                                    </>
                                ) : (
                                    "Confirm Rejection"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WithdrawalDetails;