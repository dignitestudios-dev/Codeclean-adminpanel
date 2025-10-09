import React, { useState } from 'react';
import { MessageSquare, User, Calendar, Clock, CheckCircle, AlertCircle, Eye, EyeOff, Search, Filter, RefreshCw } from 'lucide-react';
import useFetchUserIssues from '../contexts/useFetchUserIssues';
import useMarkIssueAsRead from '../contexts/useMarkIssueAsRead';

const Reviews = () => {
  const [page, setPage] = useState(1);
  const { reports, pagination, loading, error, refetch } = useFetchUserIssues(page);
  const { markIssueAsRead, loading: markLoading, error: markError, success: markSuccess } = useMarkIssueAsRead();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [processingIssueId, setProcessingIssueId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleMarkAsRead = async (issueId) => {
    if (!issueId) {
      console.error("Issue ID is missing");
      return;
    }
    console.log("Marking issue as read with ID:", issueId); // Add logging here
    setProcessingIssueId(issueId); // Set the issue being processed
    await markIssueAsRead(issueId); // Ensure issueId is passed correctly here
    refetch(); // Fetch updated data after marking as read
  };


  const handleViewDetails = (issue) => {
    setSelectedIssue(issue);
  };


  const closeModal = () => {
    setSelectedIssue(null);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Filter issues based on search and status
  const filteredIssues = reports?.filter(issue => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.user.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'pending' && !issue.is_marked) ||
      (filterStatus === 'marked' && issue.is_marked);

    return matchesSearch && matchesStatus;
  }) || [];

  console.log(reports, "reports")

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading reviews...</p>
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
            <h2 className="text-lg font-semibold text-red-900">Error Loading Reviews</h2>
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
        {markSuccess && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <p className="text-sm font-medium text-green-800">Issue marked as read successfully!</p>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {markError && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <p className="text-sm font-medium text-red-800">{markError}</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Issues</h1>
              <p className="text-gray-600 mt-2">Monitor and manage user feedback</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={refetch}
                disabled={loading}
                className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <div className="bg-white px-6 py-4 rounded-lg shadow-sm border border-gray-200">
                <div className="text-sm text-gray-500">Total Issues</div>
                <div className="text-2xl font-bold text-gray-900">{pagination.total || 0}</div>
              </div>
              <div className="bg-white px-6 py-4 rounded-lg shadow-sm border border-gray-200">
                <div className="text-sm text-gray-500">Pending</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {reports?.filter(i => !i.is_marked).length || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, description, or user name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-3">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border-none focus:outline-none text-sm text-gray-700"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="marked">Marked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Issues Grid */}
        {filteredIssues && filteredIssues.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {filteredIssues.map((issue) => (
                <div
                  key={issue.issue_id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold text-gray-900">
                          Issue #{issue.issue_id}
                        </span>
                      </div>
                      {issue.is_marked ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <EyeOff className="w-3 h-3 mr-1" />
                          Marked
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Eye className="w-3 h-3 mr-1" />
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    {/* User Info */}
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm mr-3">
                        {issue.user.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{issue.user.name}</div>
                        <div className="text-xs text-gray-500">{issue.user.email}</div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-1">
                      {issue.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {issue.description}
                    </p>

                    {/* Date & Time */}
                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span className="mr-3">{issue.date}</span>
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{issue.time}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(issue)}
                        className="flex-1 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                      >
                        View Details
                      </button>
                      {!issue.is_marked && (
                        <button
                          onClick={() => handleMarkAsRead(issue.issue_id)}  // Correctly passing the issue_id here
                          disabled={markLoading && processingIssueId === issue.issue_id}
                          className="flex-1 px-3 py-2 text-xs font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {markLoading && processingIssueId === issue.issue_id ? (
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
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.lastPage > 1 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-medium">{filteredIssues.length}</span> of{' '}
                  <span className="font-medium">{pagination.total || 0}</span> issues
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1 || loading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-gray-700">
                    Page {pagination.currentPage || page} of {pagination.lastPage || 1}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === pagination.lastPage || loading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Issues Found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all'
                ? 'No issues match your search criteria.'
                : 'There are currently no issues to display.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal for Issue Details */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Issue Details</h2>
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
                  <div className="text-sm font-medium text-gray-500 mb-1">Issue ID</div>
                  <div className="text-lg font-semibold text-gray-900">#{selectedIssue.issue_id}</div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-blue-900 mb-3">Submitted By</div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-semibold text-lg mr-3">
                      {selectedIssue.user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <User className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {selectedIssue.user.name}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">{selectedIssue.user.email}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-purple-900 mb-2">Title</div>
                  <div className="text-gray-900 font-semibold">{selectedIssue.title}</div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-yellow-900 mb-2">Description</div>
                  <div className="text-gray-900 whitespace-pre-wrap">{selectedIssue.description}</div>
                </div>

                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Submitted On</div>
                    <div className="text-gray-900">
                      {selectedIssue.date} at {selectedIssue.time}
                    </div>
                  </div>
                  <div>
                    {selectedIssue.is_marked ? (
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
                  {!selectedIssue.is_marked && (
                    <button
                      onClick={() => {
                        handleMarkAsRead(selectedIssue.issue_id);
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

export default Reviews;