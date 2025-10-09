import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Bell, Send, Clock, Users, CheckCircle2, Calendar, Plus, X, AlertCircle } from "lucide-react";
import useNotifications from "../contexts/Getnotification";
import useAddNotification from "../contexts/useAddNotification";

const NotificationsPage = () => {
  const { notifications, loading, error, totalPages, currentPage, setCurrentPage, totalSendNotifications, totalPendingNotifications, totalRecipients } = useNotifications();
  const { addNotification, loading: addLoading, error: addError, success } = useAddNotification();
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    body: ""
  });

  const handlePagination = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAddNotification = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      title: "",
      body: ""
    });
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };


  const handleInputChange = (e) => {
  const { name, value } = e.target;

  // Word count and character count validation
  const wordCount = value.trim().split(/\s+/).length;
  const charCount = value.length;

  if (wordCount <= 25 && charCount <= 152) {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.title && formData.body) {
      await addNotification(formData.title, formData.body);
      
      // Success ke baad modal close aur form reset
      if (success) {
        handleCloseModal();
        // Optionally refresh notifications list
        // You can call a refresh function here if available
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-red-800">Error Loading Notifications</h3>
          </div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      icon: Send,
      label: "Total Sent",
      value: totalSendNotifications || 0,
      bgColor: "bg-gradient-to-br from-green-500 to-emerald-600",
      iconBg: "bg-green-400/30"
    },
    {
      icon: Clock,
      label: "Pending",
      value: totalPendingNotifications || 0,
      bgColor: "bg-gradient-to-br from-amber-500 to-orange-600",
      iconBg: "bg-amber-400/30"
    },
    {
      icon: Users,
      label: "Total Recipients",
      value: totalRecipients || 0,
      bgColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
      iconBg: "bg-blue-400/30"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Notifications Dashboard</h1>
                <p className="text-gray-600 text-sm">Manage and track all your notifications</p>
              </div>
            </div>
            
            <button
              onClick={handleAddNotification}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Notification
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsCards.map((stat, idx) => (
            <div key={idx} className={`${stat.bgColor} rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-4xl font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.iconBg} w-14 h-14 rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Bell className="w-6 h-6" />
              Recent Notifications
            </h2>
          </div>

          <div className="p-6">
            {notifications && notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.notification_id} className="group border-2 border-gray-100 rounded-xl p-6 hover:border-indigo-200 hover:shadow-lg transition-all bg-gradient-to-r from-white to-gray-50">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <Bell className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">
                              {notification.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">{notification.body}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 md:items-end">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 w-fit ${
                          notification.status === 'sent' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          <CheckCircle2 className="w-3 h-3" />
                          {notification.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">{notification.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{notification.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-indigo-600" />
                        <span className="font-semibold text-indigo-600">{notification.delivered} delivered</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium">No notifications found</p>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                <button
                  onClick={() => handlePagination("prev")}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md disabled:hover:shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <span className="text-sm text-gray-600">
                    Page <span className="font-bold text-indigo-600 text-lg mx-1">{currentPage}</span> of <span className="font-bold text-gray-800 text-lg mx-1">{totalPages}</span>
                  </span>
                </div>

                <button
                  onClick={() => handlePagination("next")}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md disabled:hover:shadow-sm"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Notification Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 flex items-center justify-between sticky top-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Add New Notification</h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notification Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter notification title"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message Body <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="body"
                  value={formData.body}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  placeholder="Enter notification message"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
                />
              </div>

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700 font-medium">
                    Notification sent successfully!
                  </p>
                </div>
              )}

              {/* Error Message */}
              {addError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 font-medium">
                    {addError}
                  </p>
                </div>
              )}

          

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={addLoading}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {addLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Notification
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;