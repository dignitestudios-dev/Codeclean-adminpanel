import React, { useEffect, useState } from 'react';
import {
  Star, MapPin, Mail, Phone, Award, Calendar,
  CheckCircle, XCircle, Clock, DollarSign,
  FileText, Image, ChevronLeft, ChevronRight,
  User, Briefcase, Shield
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import GetServiceProviderDetails from '../contexts/GetServiceProviderDetails';
import useUserStatusToggle from '../contexts/useUserStatusToggle';

const Serviceproviderdetailpage = () => {
  const [activeTab, setActiveTab] = useState('private');
  const navigate = useNavigate();
  const { uid } = useParams();
  const [currentPrivatePage, setCurrentPrivatePage] = useState(1);
  const [currentBroadcastPage, setCurrentBroadcastPage] = useState(1);

  const { serviceProviderDetails, loading, error, getServiceProviderDetails } = GetServiceProviderDetails(
    uid,
    currentPrivatePage,
    currentBroadcastPage
  );

  console.log(serviceProviderDetails, "serviceProviderDetails")

  const { updateUserStatus, loading: statusLoading, message, error: statusError } = useUserStatusToggle();


  useEffect(() => {
    if (message) {
      getServiceProviderDetails();
    }
  }, [message]);


  const handlePagination = (direction) => {
    if (activeTab === 'private') {
      if (direction === 'next' && currentPrivatePage < serviceProviderDetails?.requests?.private_requests?.last_page) {
        setCurrentPrivatePage((prev) => prev + 1);
      } else if (direction === 'prev' && currentPrivatePage > 1) {
        setCurrentPrivatePage((prev) => prev - 1);
      }
    } else {
      if (direction === 'next' && currentBroadcastPage < serviceProviderDetails?.requests?.boradcast_requests?.last_page) {
        setCurrentBroadcastPage((prev) => prev + 1);
      } else if (direction === 'prev' && currentBroadcastPage > 1) {
        setCurrentBroadcastPage((prev) => prev - 1);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading provider details</div>;

  console.log(serviceProviderDetails, "serviceProviderDetails");

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
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const currentRequests = activeTab === 'private'
    ? serviceProviderDetails?.requests?.private_requests
    : serviceProviderDetails?.requests?.boradcast_requests;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back to Providers</span>
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
            <XCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700 font-medium">{statusError}</p>
          </div>
        )}

        {/* Provider Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-[3rem]">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={serviceProviderDetails?.avatar ? `https://code-clean-bucket.s3.us-east-2.amazonaws.com/${serviceProviderDetails?.avatar}` : 'https://i.pinimg.com/280x280_RS/e1/08/21/e10821c74b533d465ba888ea66daa30f.jpg'}
                  alt={serviceProviderDetails?.name}
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                  {serviceProviderDetails?.is_deactivate ? (
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
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{serviceProviderDetails?.name}</h1>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-gray-800">{serviceProviderDetails?.rating}</span>
                        <span className="text-gray-500 text-sm">({serviceProviderDetails?.reviews.length} reviews)</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-sm">{serviceProviderDetails?.experience} years experience</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${serviceProviderDetails?.is_deactivate
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                      }`}>
                      {serviceProviderDetails?.is_deactivate ? 'Deactivated' : 'Active'}
                    </span>
                    {serviceProviderDetails?.approval_status === 'rejected' && (
                      <span className="px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                       Profile:  Rejected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>


            {/* Action Buttons */}
            <div className="mt-6 flex gap-3 flex-wrap">
              {serviceProviderDetails?.is_deactivate ? (
                // ✅ User is deactivated → Show Reactivate Button
                <button
                  onClick={() => updateUserStatus(serviceProviderDetails.cleaner_id, "reactivate")}
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
                  onClick={() => updateUserStatus(serviceProviderDetails.cleaner_id, "deactivate")}
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
                  <p className="text-sm text-gray-800 font-semibold">{serviceProviderDetails?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Phone</p>
                  <p className="text-sm text-gray-800 font-semibold">
                    {serviceProviderDetails?.phone_number.startsWith('+1')
                      ? serviceProviderDetails?.phone_number
                      : `+1 ${serviceProviderDetails?.phone_number}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Location</p>
                  <p className="text-sm text-gray-800 font-semibold">{serviceProviderDetails?.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
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
                    Private Requests ({serviceProviderDetails?.requests?.private_requests?.total})
                  </button>
                  <button
                    onClick={() => setActiveTab('broadcast')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'broadcast'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    Broadcast Requests ({serviceProviderDetails?.requests?.boradcast_requests?.total})
                  </button>
                </div>
              </div>

              {/* Requests List */}
              <div className="p-6">
                <div className={`space-y-4 overflow-y-auto ${currentRequests?.data?.length === 0 ? 'h-[15em]' : 'h-[40em]'}`}>
                  {/* Check if currentRequests.data has items */}
                  {currentRequests?.data?.length === 0 ? (
                    <div className="text-center text-gray-600">No data available</div>
                  ) : (
                    currentRequests?.data?.map((request) => (
                      <div key={request.request_id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 text-lg mb-1">{request.title}</h3>
                            <p className="text-sm text-gray-600">{request.description}</p>
                          </div>
                          <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}>
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
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
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
                            {request.banner_images.slice(0, 3).map((img, idx) => (
                              <img
                                key={idx}
                                src={`https://code-clean-bucket.s3.us-east-2.amazonaws.com/${img}`}
                                alt="Request"
                                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handlePagination('prev')}
                    disabled={activeTab === 'private' ? currentPrivatePage === 1 : currentBroadcastPage === 1}
                    className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {activeTab === 'private' ? currentPrivatePage : currentBroadcastPage}
                  </span>
                  <button
                    onClick={() => handlePagination('next')}
                    disabled={activeTab === 'private' ? currentPrivatePage >= serviceProviderDetails?.requests?.private_requests?.last_page : currentBroadcastPage >= serviceProviderDetails?.requests?.boradcast_requests?.last_page}
                    className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>


          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-gray-800">Reviews</h2>
              </div>

              <div className="space-y-4">
                {serviceProviderDetails?.reviews?.length === 0 ? (
                  <div className="text-center text-gray-600">No reviews available</div>
                ) : (
                  serviceProviderDetails?.reviews?.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-start gap-3">
                        <img
                          src={review.user_avatar
                            ? `https://code-clean-bucket.s3.us-east-2.amazonaws.com/${review.user_avatar}`
                            : 'https://i.pinimg.com/280x280_RS/e1/08/21/e10821c74b533d465ba888ea66daa30f.jpg'}
                          alt={review.user_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{review.user_name}</p>
                          <div className="flex gap-1 my-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-600">{review.text}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Certificates Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">Certificates</h2>
              </div>

              <div className="space-y-3">
                {/* Check if certificates data exists */}
                {serviceProviderDetails?.certificates?.length === 0 ? (
                  <div className="text-center text-gray-600">No certificates available</div>
                ) : (
                  serviceProviderDetails?.certificates?.map((cert) => (
                    <div key={cert.id} className="border border-gray-200 rounded-xl p-4">
                      <h3 className="font-bold text-gray-800 mb-1">{cert.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{cert.description}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{cert.institution}</span>
                        <span>{cert.date_of_completion}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Verification Status */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-800">Verification</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">National ID Front</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${serviceProviderDetails?.identity_verfication_docs?.national_id_front
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                    }`}>
                    {serviceProviderDetails?.identity_verfication_docs?.national_id_front ? 'Verified' : 'Not Uploaded'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">National ID Back</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${serviceProviderDetails?.identity_verfication_docs?.national_id_back
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                    }`}>
                    {serviceProviderDetails?.identity_verfication_docs?.national_id_back ? 'Verified' : 'Not Uploaded'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Serviceproviderdetailpage;
