import React, { useState, useEffect } from 'react';
import { AlertCircle, Eye, EyeOff, User, Calendar, Clock, Flag, RefreshCw } from 'lucide-react';
import useFetchUserReports from '../contexts/useFetchUserReports';
import useMarkReportAsRead from '../contexts/useMarkReportAsRead';

const Reports = () => {
  const [page, setPage] = useState(1);
  const { reports, pagination, loading, error, refetch } = useFetchUserReports(page);
  const { markReportAsRead, loading: markLoading, error: markError, success } = useMarkReportAsRead();
  const [selectedReport, setSelectedReport] = useState(null);
  const [processingReportId, setProcessingReportId] = useState(null);

  // Success notification auto-hide and refetch
  useEffect(() => {
    if (success) {
      // Refetch data to show updated status
      refetch();
      
      // Auto-hide success notification after 3 seconds
      const timer = setTimeout(() => {
        setProcessingReportId(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [success, refetch]);

  const handleMarkReport = async (reportId) => {
    setProcessingReportId(reportId);
    const response = await markReportAsRead(reportId);
    if (response) {
      console.log('Report marked as read', response);
    }
  };

  const handleViewDetails = (report) => {
    setSelectedReport(report);
  };

  const closeModal = () => {
    setSelectedReport(null);
  };

  const handlePrevPage = () => {
    if (pagination.prevPageUrl) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.nextPageUrl) {
      setPage(page + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
            <h2 className="text-lg font-semibold text-red-900">Error Loading Reports</h2>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Success Notification */}
        {success && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Report marked as read successfully!</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {markError && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{markError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports Management</h1>
              <p className="text-gray-600 mt-2">Monitor and manage user reports</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={refetch}
                disabled={loading}
                className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <div className="bg-white px-6 py-4 rounded-lg shadow-sm border border-gray-200">
                <div className="text-sm text-gray-500">Total Reports</div>
                <div className="text-2xl font-bold text-gray-900">{pagination.total || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        {reports && reports.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Report ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Reporter
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Reported User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report.report_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Flag className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            #{report.report_id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm mr-3">
                            {report.reporter.reporter_name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {report.reporter.reporter_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {report.reporter.reporter_email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-semibold text-sm mr-3">
                            {report.reportable.reported_user_name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {report.reportable.reported_user_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {report.reportable.reported_user_email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {report.reason}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="mr-3">{report.date}</span>
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{report.time}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {report.is_marked ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Marked
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Eye className="w-3 h-3 mr-1" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(report)}
                            className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                          >
                            View Details
                          </button>
                          {!report.is_marked && (
                            <button
                              onClick={() => handleMarkReport(report.report_id)}
                              disabled={markLoading && processingReportId === report.report_id}
                              className="px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                              {markLoading && processingReportId === report.report_id ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600 mr-1"></div>
                                  Processing...
                                </>
                              ) : (
                                'Mark as Read'
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{reports.length}</span> of{' '}
                <span className="font-medium">{pagination.total || 0}</span> reports
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevPage}
                  disabled={!pagination.prevPageUrl}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                  Page {pagination.currentPage || page} of {pagination.lastPage || 1}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={!pagination.nextPageUrl}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
            <p className="text-gray-600">There are currently no reports to display.</p>
          </div>
        )}
      </div>

      {/* Modal for Report Details */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Report Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500 mb-1">Report ID</div>
                  <div className="text-lg font-semibold text-gray-900">#{selectedReport.report_id}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-blue-900 mb-3">Reporter</div>
                    <div className="flex items-center mb-2">
                      <User className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {selectedReport.reporter.reporter_name}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">{selectedReport.reporter.reporter_email}</div>
                  </div>

                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-red-900 mb-3">Reported User</div>
                    <div className="flex items-center mb-2">
                      <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {selectedReport.reportable.reported_user_name}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">{selectedReport.reportable.reported_user_email}</div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-yellow-900 mb-2">Reason</div>
                  <div className="text-gray-900">{selectedReport.reason}</div>
                </div>

                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Date & Time</div>
                    <div className="text-gray-900">
                      {selectedReport.date} at {selectedReport.time}
                    </div>
                  </div>
                  <div>
                    {selectedReport.is_marked ? (
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <EyeOff className="w-4 h-4 mr-2" />
                        Marked as Read
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        <Eye className="w-4 h-4 mr-2" />
                        Pending Review
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                  {!selectedReport.is_marked && (
                    <button
                      onClick={() => {
                        handleMarkReport(selectedReport.report_id);
                        closeModal();
                      }}
                      disabled={markLoading}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {markLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        'Mark as Read'
                      )}
                    </button>
                  )}
                
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;