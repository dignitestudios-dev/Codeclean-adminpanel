import React, { useState } from "react";
import {
    Search, ChevronLeft, ChevronRight,
    UserCheck, Clock, Mail, Phone,
    MapPin, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';
import { FaRegEye } from "react-icons/fa";
import useApprovalRequests from "../contexts/useApprovalRequests";
import useRequestDetails from "../contexts/useRequestDetails";
import { useNavigate } from "react-router-dom";

const ApprovalRequestsPage = () => {
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const { approvalRequests, pagination, loading, error, fetchApprovalRequests } = useApprovalRequests(page);


    const {
        requestDetails,
        loading: detailsLoading,
        error: detailsError,
        fetchRequestDetails,
    } = useRequestDetails(
        selectedUser?.request_id,   // or selected request id (optional)
        selectedUser?.role,
        selectedUser?.id
    );


    // Filter search and sort by newest first
    const filteredRequests = approvalRequests?.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone_number.includes(searchTerm)
    ).sort((a, b) => {
       
        return b.id - a.id; // Newest (higher id) first
    }) || [];

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock className="w-4 h-4" /> },
            approved: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle className="w-4 h-4" /> },
            rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle className="w-4 h-4" /> },
        };
        const cfg = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                {cfg.icon}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    // Modal open handler
    // 👇 Update this function
    const handleOpenDetails = (user) => {
        navigate("/approval-requests", {
            state: {
                provider_id: user.uid,
            },
        });
    };


    // Modal close handler
    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        </div>
    );

    if (error) return (
        <div className="p-10 text-center text-red-600">
            <AlertCircle className="w-6 h-6 mx-auto mb-2" />
            <p>{error}</p>
            <button onClick={fetchApprovalRequests} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Retry</button>
        </div>
    );

    const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return "No Phone Number";

  const cleanedNumber = phoneNumber.replace(/\D/g, "");

  if (cleanedNumber.length === 10) {
    return `+1 ${cleanedNumber.slice(0, 3)}-${cleanedNumber.slice(3, 6)}-${cleanedNumber.slice(6)}`;
  }

  return "+1 " + cleanedNumber;
};

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <UserCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Approval Requests</h1>
                        <p className="text-slate-600">Review and manage pending approvals</p>
                    </div>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">User</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Contact</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Address</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Role</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Status</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredRequests.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800">{user.name}</p>
                                                <p className="text-xs text-slate-500">ID: {user.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Mail className="w-4 h-4 text-slate-400" />
                                                <span>{user.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Phone className="w-4 h-4 text-slate-400" />
                                                <span>{formatPhoneNumber(user?.phone_number)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-slate-600">{user.address}</td>
                                    <td className="py-4 px-6 text-sm text-slate-600">{user.role}</td>
                                    <td className="py-4 px-6">{getStatusBadge(user.is_approved)}</td>
                                    <td className="py-4 px-6">
                                        <button
                                            onClick={() => handleOpenDetails(user)}
                                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                                        >
                                            <FaRegEye />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={pagination.current_page === 1}
                        className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50"
                    >
                        <ChevronLeft className="w-4 h-4 inline mr-1" /> Prev
                    </button>
                    <span className="text-sm text-slate-600">
                        Page {pagination.current_page} of {pagination.last_page}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
                        disabled={pagination.current_page === pagination.last_page}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        Next <ChevronRight className="w-4 h-4 inline ml-1" />
                    </button>
                </div>
            </div>

            {/* 🔹 MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative shadow-lg animate-fade-in">
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-slate-500 hover:text-slate-800"
                        >
                            ✕
                        </button>

                        {detailsLoading ? (
                            <div className="text-center py-10">
                                <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent mx-auto mb-4 rounded-full"></div>
                                <p className="text-gray-600">Loading details...</p>
                            </div>
                        ) : detailsError ? (
                            <p className="text-center text-red-500">{detailsError}</p>
                        ) : (
                            requestDetails && (
                                <>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-2">{requestDetails.title}</h2>
                                    <p className="text-gray-600 mb-4">{requestDetails.description}</p>

                                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-700">
                                        <p><strong>Date:</strong> {requestDetails.date}</p>
                                        <p><strong>Time:</strong> {requestDetails.time}</p>
                                        <p><strong>Status:</strong> {requestDetails.status}</p>
                                        <p><strong>Total Payment:</strong> ${requestDetails.total_payment}</p>
                                    </div>

                                    <h3 className="font-semibold mb-2 text-gray-800">Cleaning Services</h3>
                                    <ul className="list-disc ml-5 text-gray-700 mb-4">
                                        {requestDetails.cleaning_services.map((s) => (
                                            <li key={s.id}>{s.title} × {s.quantity}</li>
                                        ))}
                                    </ul>

                                    <h3 className="font-semibold mb-2 text-gray-800">
                                        {selectedUser.role === "user" ? "Service Provider" : "Customer"} Info
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={`https://code-clean-bucket.s3.us-east-2.amazonaws.com/${requestDetails.counterpart.avatar}`}
                                            alt={requestDetails.counterpart.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-800">{requestDetails.counterpart.name}</p>
                                            {requestDetails.counterpart.rating && (
                                                <p className="text-sm text-yellow-600">⭐ {requestDetails.counterpart.rating}</p>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApprovalRequestsPage;
