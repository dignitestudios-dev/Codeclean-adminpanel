import React, { useState, useEffect } from 'react';
import {
  User, MapPin, Mail, Phone, Calendar,
  CheckCircle, XCircle, Clock, DollarSign,
  FileText, ChevronLeft, ChevronRight,
  Package, Activity, AlertCircle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import GetUserDetails from '../contexts/GetUserDetails';
import useUserStatusToggle from '../contexts/useUserStatusToggle';

const Userdetails = () => {
  const [activeTab, setActiveTab] = useState('private');
  const navigate = useNavigate();
  const { uid } = useParams();
  const [currentPrivatePage, setCurrentPrivatePage] = useState(1);
  const [currentBroadcastPage, setCurrentBroadcastPage] = useState(1);

  // Get user details based on current tab and pagination state
  const { userDetails, loading, error, getUserDetails } = GetUserDetails(uid, currentPrivatePage, currentBroadcastPage);


  // User status toggle hook
  const { updateUserStatus, loading: statusLoading, message, error: statusError } = useUserStatusToggle();

  // Refresh data when status changes
  useEffect(() => {
    if (message) {
      getUserDetails(); // Refresh user info in real-time
    }
  }, [message]);

  console.log(userDetails, "userDetails")

  // Handle loading and error states
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600 text-lg">Loading user details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <p className="text-red-600 text-lg">Error loading user details</p>
      </div>
    </div>
  );

  const handlePagination = (direction) => {
    if (activeTab === 'private') {
      // Pagination logic for private requests
      if (direction === 'next' && currentPrivatePage < userDetails?.requests?.private?.last_page) {
        setCurrentPrivatePage(prev => prev + 1); // Move to the next page
      } else if (direction === 'prev' && currentPrivatePage > 1) {
        setCurrentPrivatePage(prev => prev - 1); // Move to the previous page
      }
    } else {
      // Pagination logic for broadcast requests
      if (direction === 'next' && currentBroadcastPage < userDetails?.requests?.broadcast_requests?.last_page) {
        setCurrentBroadcastPage(prev => prev + 1); // Move to the next page
      } else if (direction === 'prev' && currentBroadcastPage > 1) {
        setCurrentBroadcastPage(prev => prev - 1); // Move to the previous page
      }
    }
  };

  // Handle active tab to switch between private and broadcast requests
  const currentRequests = activeTab === 'private'
    ? userDetails?.requests?.private
    : userDetails?.requests?.broadcast_requests;

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'bg-green-100 text-green-700 border-green-200',
      'cancelled': 'bg-red-100 text-red-700 border-red-200',
      'rejected': 'bg-orange-100 text-orange-700 border-orange-200',
      'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Calculate statistics dynamically from API data
  const totalRequests = userDetails?.requests?.private?.total + userDetails?.requests?.broadcast_requests?.total;
  const completedRequests = [
    ...userDetails?.requests?.private?.data,
    ...userDetails?.requests?.broadcast_requests?.data
  ].filter(req => req.status === 'completed').length;

  const totalSpent = [
    ...userDetails?.requests?.private?.data,
    ...userDetails?.requests?.broadcast_requests?.data
  ]
    .filter(req => req.status === 'completed')
    .reduce((sum, req) => sum + parseFloat(req.amount), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back to Users</span>
          </button>
        </div>

        {/* Status Messages */}
        {message && (
          <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-700 font-medium">{message}</p>
          </div>
        )}

        {statusError && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700 font-medium">{statusError}</p>
          </div>
        )}

        {/* User Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-[3rem]">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={userDetails?.avatar ? `https://code-clean-bucket.s3.us-east-2.amazonaws.com/${userDetails?.avatar}` : 'https://i.pinimg.com/280x280_RS/e1/08/21/e10821c74b533d465ba888ea66daa30f.jpg'}
                  alt={userDetails?.name}
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                  {userDetails?.is_deactivate ? (
                    <XCircle className="w-6 h-6 text-red-500" />
                  ) : (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 capitalize">{userDetails?.name}</h1>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">Customer</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Package className="w-4 h-4" />
                        <span className="text-sm">{totalRequests} Total Requests</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${userDetails?.is_deactivate ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {userDetails?.is_deactivate ? 'Deactivated' : 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3 flex-wrap">
              {userDetails?.is_deactivate ? (
                // ✅ User is deactivated → Show Reactivate Button
                <button
                  onClick={() => updateUserStatus(userDetails.user_id, "reactivate")}
                  disabled={statusLoading}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  {statusLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Reactivate User
                    </>
                  )}
                </button>
              ) : (
                // ✅ User is active → Show Deactivate Button
                <button
                  onClick={() => updateUserStatus(userDetails.user_id, "deactivate")}
                  disabled={statusLoading}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  {statusLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      Deactivate User
                    </>
                  )}
                </button>
              )}
            </div>


            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Email</p>
                  <p className="text-sm text-gray-800 font-semibold break-all">{userDetails?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Phone</p>
                  <p className="text-sm text-gray-800 font-semibold">
                    {userDetails?.phone_number
                      ? (userDetails?.phone_number.startsWith('+1')
                        ? userDetails?.phone_number
                        : `+1 ${userDetails?.phone_number}`)
                      : 'No number found'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Location</p>
                  <p className="text-sm text-gray-800 font-semibold">
                    {userDetails?.location ? userDetails?.location : 'No location found'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Total Requests</p>
                <p className="text-3xl font-bold text-gray-800">{totalRequests}</p>
                <p className="text-xs text-gray-500 mt-1">All time requests</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-600">{completedRequests}</p>
                <p className="text-xs text-gray-500 mt-1">Successfully completed</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Total Spent</p>
                <p className="text-3xl font-bold text-indigo-600">${totalSpent.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">On completed requests</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl">
                <DollarSign className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Requests Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Service Requests</h2>

            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('private')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'private'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                Private Requests ({userDetails?.requests?.private?.total})
              </button>
              <button
                onClick={() => setActiveTab('broadcast')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'broadcast'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                Broadcast Requests ({userDetails?.requests?.broadcast_requests?.total})
              </button>
            </div>
          </div>

          {/* Requests List */}
          <div className="p-6">
            <div className="space-y-4">
              {currentRequests?.data?.map((request) => (
                <div key={request.request_id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-800 text-lg">{request.title}</h3>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                          #{request.request_id}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{request.description}</p>
                    </div>
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`} >
                      {getStatusIcon(request.status)}
                      {request.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Amount</p>
                      <p className="text-sm font-bold text-green-600 flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {request.amount}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Duration</p>
                      <p className="text-sm font-semibold text-gray-800">{request.duration}h</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date</p>
                      <p className="text-sm font-semibold text-gray-800">{request.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Type</p>
                      <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full font-semibold">
                        {request.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{request.location}</span>
                  </div>

                  {request.banner_images.length > 0 && (
                    <div className="mt-3 flex gap-2">
                      {request.banner_images.slice(0, 4).map((img, idx) => (
                        <img
                          key={idx}
                          src={`https://code-clean-bucket.s3.us-east-2.amazonaws.com/${img}`}
                          alt="Request"
                          className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                        />
                      ))}
                      {request.banner_images.length > 4 && (
                        <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                          <span className="text-xs font-semibold text-gray-600">
                            +{request.banner_images.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {currentRequests?.last_page > 1 && (
              <div className="mt-6 flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600">
                  Page <span className="font-semibold text-gray-800">{currentRequests.current_page}</span> of <span className="font-semibold text-gray-800">{currentRequests.last_page}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePagination('prev')}
                    disabled={currentRequests.current_page === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handlePagination('next')}
                    disabled={currentRequests.current_page === currentRequests.last_page}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userdetails;