import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, DollarSign, Package, User, Star, Image, Mail, Phone, Award, Briefcase, Shield, FileText, X, AlertCircle, CheckCircle } from 'lucide-react';
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate, useLocation } from 'react-router-dom';
import useProviderDetails from '../contexts/useRequestDetails';
import useApproveRejectRequest from '../contexts/useApproveRejectRequest';

const UserRequestDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { provider_id } = location.state || {};
  const { providerDetails, loading, error } = useProviderDetails(provider_id);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedReasonType, setSelectedReasonType] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successType, setSuccessType] = useState(''); // 'approve' or 'reject'
  const { approveRequest, rejectRequest, loading: actionLoading, error: actionError, success } = useApproveRejectRequest();
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  const rejectionReasons = [
    'Incomplete documentation',
    'Invalid ID verification',
    'Insufficient experience',
    'Other'
  ];

  // Show success message when action completes
  useEffect(() => {
    if (success) {
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        navigate(-1);
      }, 3000);
    }
  }, [success, navigate]);

  const handleOpenImage = (imgUrl) => {
    setSelectedImage(imgUrl);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

const handleApprove = async () => {
    if (!providerDetails?.cleaner_id) return alert("No Cleaner ID found.");
    setApproveLoading(true);  // ⭐ Add this line
    setSuccessMessage('Provider approved successfully!');
    setSuccessType('approve');
    await approveRequest(providerDetails.cleaner_id);
    setApproveLoading(false);  // ⭐ Add this line
};

  const handleReject = async () => {
    if (!providerDetails?.cleaner_id) return alert("No Cleaner ID found.");
    setShowRejectModal(true);
  };

const confirmReject = async () => {
    if (!selectedReasonType && !rejectionReason) {
      alert("Please select or enter a reason for rejection");
      return;
    }
    const finalReason = selectedReasonType === 'Other' ? rejectionReason : selectedReasonType;
    setRejectLoading(true);  // ⭐ Add this line
    setSuccessMessage('Provider rejected successfully!');
    setSuccessType('reject');
    await rejectRequest(providerDetails.cleaner_id, finalReason);
    setRejectLoading(false);  // ⭐ Add this line
    setShowRejectModal(false);
    setRejectionReason('');
    setSelectedReasonType('');
};

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectionReason('');
    setSelectedReasonType('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading provider details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!providerDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <p className="text-gray-600">No provider details found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const totalRequests = (providerDetails.requests?.private_requests?.total || 0) +
    (providerDetails.requests?.boradcast_requests?.total || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Success Message Toast */}
      {showSuccessMessage && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border-2 ${successType === 'approve'
              ? 'bg-green-50 border-green-500'
              : 'bg-red-50 border-red-500'
            }`}>
            {successType === 'approve' ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <X className="w-6 h-6 text-red-600" />
            )}
            <div>
              <p className={`font-bold ${successType === 'approve' ? 'text-green-900' : 'text-red-900'
                }`}>
                {successMessage}
              </p>
              <p className="text-sm text-gray-600">Redirecting back...</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message Toast */}
      {actionError && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right duration-300">
          <div className="flex items-center gap-3 px-6 py-4 bg-red-50 border-2 border-red-500 rounded-xl shadow-2xl">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <p className="font-bold text-red-900">Action Failed</p>
              <p className="text-sm text-gray-600">{actionError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className='flex items-center gap-3'>
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md"
            >
              <IoArrowBackSharp
                className='text-gray-700 hover:text-blue-600 transition-colors'
                size={26}
              />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Provider Details</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Provider Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 p-1 shadow-lg">
                    {providerDetails.avatar ? (
                      <img
                        src={`https://code-clean-bucket.s3.us-east-2.amazonaws.com/${providerDetails.avatar}`}
                        alt={providerDetails.name}
                        className="w-full h-full rounded-2xl object-cover bg-white"
                      />
                    ) : (
                      <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                        <User className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">{providerDetails.name}</h2>
                      <p className="text-gray-500 text-sm">UID: <span className="font-mono text-gray-700">{providerDetails.cleaner_uid}</span></p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${providerDetails.is_deactivate
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'bg-green-100 text-green-700 border border-green-200'
                      }`}>
                      {providerDetails.approval_status ? 'Pending' : 'Active'}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-xl py-2 px-4 shadow-sm">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="text-lg font-bold text-gray-900">{providerDetails.rating}</span>
                      <span className="text-sm text-gray-600">Rating</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-300 rounded-xl py-2 px-4 shadow-sm">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-900">{providerDetails.experience} Years</span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 text-sm bg-blue-50 p-3 rounded-xl border border-blue-100">
                      <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                        <Mail className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 truncate font-medium">{providerDetails.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm bg-green-50 p-3 rounded-xl border border-green-100">
                      <div className="p-2 bg-green-500 rounded-lg shadow-sm">
                        <Phone className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">{providerDetails.phone_number}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 shadow-sm">
                <div className="p-3 bg-purple-500 rounded-xl shadow-sm">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-purple-700 font-semibold uppercase tracking-wide">Location</div>
                  <div className="text-sm font-bold text-gray-900 mt-0.5">{providerDetails.location}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{providerDetails.address}</div>
                </div>
              </div>

              {/* Description */}
              {providerDetails.description && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">About</h3>
                  <p className="text-gray-600 leading-relaxed">{providerDetails.description}</p>
                </div>
              )}

              {/* Expertise */}
              {providerDetails.expertise && (
                <div className="mt-6">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2 uppercase tracking-wide">
                    <Award className="w-5 h-5 text-blue-600" />
                    Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {providerDetails.expertise.split(',').map((skill, index) => (
                      <span key={index} className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-xl text-sm font-semibold border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Identity Verification */}
            {providerDetails.identity_verfication_docs && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Identity Verification</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {providerDetails?.identity_verfication_docs?.national_id_front?.url && (
                    <div
                      className="relative group cursor-pointer overflow-hidden rounded-xl border-2 border-gray-200 hover:border-green-400 transition-all shadow-md hover:shadow-xl"
                      onClick={() =>
                        handleOpenImage(
                          `https://code-clean-bucket.s3.us-east-2.amazonaws.com/${providerDetails.identity_verfication_docs.national_id_front.url}`
                        )
                      }
                    >
                      <img
                        src={`https://code-clean-bucket.s3.us-east-2.amazonaws.com/${providerDetails.identity_verfication_docs.national_id_front.url}`}
                        alt="National ID Front"
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white font-bold text-sm">National ID (Front)</p>
                          <p className="text-gray-200 text-xs">Click to view full size</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {providerDetails?.identity_verfication_docs?.national_id_back?.url && (
                    <div
                      className="relative group cursor-pointer overflow-hidden rounded-xl border-2 border-gray-200 hover:border-green-400 transition-all shadow-md hover:shadow-xl"
                      onClick={() =>
                        handleOpenImage(
                          `https://code-clean-bucket.s3.us-east-2.amazonaws.com/${providerDetails.identity_verfication_docs.national_id_back.url}`
                        )
                      }
                    >
                      <img
                        src={`https://code-clean-bucket.s3.us-east-2.amazonaws.com/${providerDetails.identity_verfication_docs.national_id_back.url}`}
                        alt="National ID Back"
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white font-bold text-sm">National ID (Back)</p>
                          <p className="text-gray-200 text-xs">Click to view full size</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Image Modal */}
            {selectedImage && (
              <div
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
                onClick={handleCloseImage}
              >
                <div className="relative max-w-5xl w-full">
                  <button
                    onClick={handleCloseImage}
                    className="absolute -top-12 right-0 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-800" />
                  </button>
                  <img
                    src={selectedImage}
                    alt="Zoomed ID"
                    className="w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            )}

            {/* Certificates */}
            {providerDetails.certificates && providerDetails.certificates.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Certificates</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {providerDetails.certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-lg transition-all bg-gradient-to-br from-gray-50 to-white"
                    >
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">{cert.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium text-gray-700">Institution:</span> {cert.institution}
                      </p>
                      {cert.description && (
                        <p className="text-sm text-gray-500 mb-2 italic">"{cert.description}"</p>
                      )}
                      <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                        <span>
                          <span className="font-medium">Completed:</span>{" "}
                          {new Date(cert.date_of_completion).toLocaleDateString()}
                        </span>
                        <span className="text-gray-400">
                          ID: <span className="font-mono">{cert.id}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {providerDetails.reviews && providerDetails.reviews.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-yellow-100 rounded-xl">
                    <Star className="w-6 h-6 text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Reviews</h3>
                </div>
                <div className="space-y-4">
                  {providerDetails.reviews.map((review, index) => (
                    <div key={index} className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 font-medium">{review.date}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-2">{review.comment}</p>
                      <p className="text-sm text-gray-600 font-semibold">— {review.user_name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Account Info</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Cleaner ID</span>
                  <span className="font-bold text-gray-900 font-mono">{providerDetails.cleaner_id}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Experience</span>
                  <span className="font-bold text-gray-900">{providerDetails.experience} years</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Rating</span>
                  <span className="font-bold text-gray-900">{providerDetails.rating}/5.0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Status</span>
                  <span className={`font-bold ${providerDetails.is_deactivate ? 'text-red-600' : 'text-green-600'}`}>
                    {providerDetails.approval_status ? 'Pending' : 'Active'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleApprove}
                disabled={approveLoading || rejectLoading}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Shield className="w-5 h-5" />
                {approveLoading ? 'Processing...' : 'Approve Provider'}
              </button>
              <button
                onClick={handleReject}
                disabled={approveLoading || rejectLoading}
                className="w-full px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                {rejectLoading ? 'Processing...' : 'Reject Provider'}
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Package className="w-6 h-6" />
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-white/20">
                  <span className="text-blue-100">Total Requests</span>
                  <span className="text-3xl font-bold">{totalRequests}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/20">
                  <span className="text-blue-100">Private Requests</span>
                  <span className="text-3xl font-bold">{providerDetails.requests?.private_requests?.total || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Broadcast Requests</span>
                  <span className="text-3xl font-bold">{providerDetails.requests?.boradcast_requests?.total || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Reject Provider</h3>
              </div>
              <button
                onClick={closeRejectModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">Please select or enter a reason for rejecting this provider.</p>

            <div className="space-y-3 mb-6">
              {rejectionReasons.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedReasonType === reason
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                    }`}
                >
                  <input
                    type="radio"
                    name="rejectionReason"
                    value={reason}
                    checked={selectedReasonType === reason}
                    onChange={(e) => setSelectedReasonType(e.target.value)}
                    className="w-4 h-4 text-red-600"
                  />
                  <span className="text-gray-700 font-medium">{reason}</span>
                </label>
              ))}
            </div>

            {selectedReasonType === 'Other' && (
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter detailed reason..."
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all mb-6 resize-none"
                rows="4"
              />
            )}

            <div className="flex gap-3">
              <button
                onClick={closeRejectModal}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={!selectedReasonType || (selectedReasonType === 'Other' && !rejectionReason)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRequestDetail;