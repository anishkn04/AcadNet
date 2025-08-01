import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faEye, faTimes, faExclamationTriangle, faRefresh, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { getGroupReportsAPI, updateReportStatusAPI } from '@/services/UserServices';
import { useData } from '@/hooks/userInfoContext';
import { toast } from "@/utils/toast";

interface Report {
  id: number;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed' | 'removed';
  created_at: string;
  reporter: {
    user_id: number;
    username: string;
    fullName: string;
  };
  reportedUser: {
    user_id: number;
    username: string;
    fullName: string;
  };
  reviewer?: {
    user_id: number;
    username: string;
    fullName: string;
  } | null;
  studyGroup: {
    id: string;
    name: string;
    groupCode: string;
  };
}

interface ComplaintsSectionProps {
  groupCode: string;
}

const ComplaintsSection: React.FC<ComplaintsSectionProps> = ({ groupCode }) => {
  const { removeGroupMember } = useData();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // State for remove user confirmation
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [groupCode]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // Always fetch all reports and filter on frontend
      const response = await getGroupReportsAPI(groupCode);
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        // Handle multiple possible response structures
        let reportsData = [];
        
        if (response.data.data?.reports) {
          reportsData = response.data.data.reports;
        } else if (response.data.reports) {
          reportsData = response.data.reports;
        } else if (response.data.message?.reports) {
          reportsData = response.data.message.reports;
        } else if (Array.isArray(response.data.data)) {
          reportsData = response.data.data;
        } else if (Array.isArray(response.data.message)) {
          reportsData = response.data.message;
        }
        setReports(reportsData);
      } else {
        toast.error(response.data.message || 'Failed to fetch reports');
      }
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { class: 'bg-yellow-100 text-yellow-800', text: 'Pending', icon: faExclamationTriangle },
      reviewed: { class: 'bg-blue-100 text-blue-800', text: 'Reviewed', icon: faEyeSlash },
      dismissed: { class: 'bg-gray-100 text-gray-800', text: 'Ignored', icon: faEyeSlash },
      resolved: { class: 'bg-red-100 text-red-800', text: 'Removed', icon: faTimes }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
        <FontAwesomeIcon icon={config.icon} className="mr-1 text-xs" />
        {config.text}
      </span>
    );
  };

  const getReasonLabel = (reason: string) => {
    const reasonLabels: { [key: string]: string } = {
      inappropriate_behavior: 'Inappropriate Behavior',
      harassment: 'Harassment',
      spam: 'Spam',
      offensive_content: 'Offensive Content',
      violation_of_rules: 'Violation of Rules',
      fake_profile: 'Fake Profile',
      academic_dishonesty: 'Academic Dishonesty',
      other: 'Other'
    };
    
    return reasonLabels[reason] || reason;
  };

  const handleViewDetail = (report: Report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleRemoveUser = async () => {
    if (!selectedReport) return;
    
    setShowRemoveConfirmation(true);
  };

  const handleConfirmRemoveUser = async () => {
    if (!selectedReport) return;
    
    setIsRemoving(true);
    try {
      const result = await removeGroupMember(groupCode, selectedReport.reportedUser.user_id);
      if (result.success) {
        // Update the report status in the backend to 'resolved'
        const updateResponse = await updateReportStatusAPI(selectedReport.id, 'resolved', 'User removed from group by admin');
        if (updateResponse.data.success) {
          toast.success(`${selectedReport.reportedUser.username} has been removed from the group`);
          setShowDetailModal(false);
          setShowRemoveConfirmation(false);
          // Update the report status to 'resolved' in local state
          setReports(prev => prev.map(report => 
            report.id === selectedReport.id 
              ? { ...report, status: 'resolved' as const }
              : report
          ));
        } else {
          toast.error('User removed but failed to update report status');
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to remove user from group');
      console.error('Remove user error:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleIgnoreReport = async () => {
    if (!selectedReport) return;
    
    try {
      const response = await updateReportStatusAPI(selectedReport.id, 'dismissed', 'Report ignored by admin');
      if (response.data.success) {
        toast.success('Report has been ignored');
        setShowDetailModal(false);
        // Update the report in the local state
        setReports(prev => prev.map(report => 
          report.id === selectedReport.id 
            ? { ...report, status: 'dismissed' as const }
            : report
        ));
      } else {
        toast.error('Failed to ignore report');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to ignore report');
      console.error('Ignore report error:', error);
    }
  };

  const filteredReports = reports.filter(report => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'ignored') return report.status === 'dismissed';
    if (statusFilter === 'removed') return report.status === 'resolved';
    return report.status === statusFilter;
  });

  const reportStats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    ignored: reports.filter(r => r.status === 'dismissed').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    removed: reports.filter(r => r.status === 'resolved').length,
  };

  if (loading) {
    return (
      <section className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <FontAwesomeIcon icon={faFlag} className="text-red-600 text-lg" />
            </div>
            <div>
              <h3 className="text-slate-800 text-lg sm:text-xl font-semibold leading-tight tracking-tight">
                User Reports & Complaints
              </h3>
              <p className="text-slate-600 text-sm">Manage user reports and take appropriate actions</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={fetchReports}
            className="flex items-center gap-2 hover:bg-red-50 hover:border-red-300 w-full sm:w-auto"
            disabled={loading}
          >
            <FontAwesomeIcon icon={faRefresh} className="animate-spin" />
            Refresh
          </Button>
        </div>
        <Card className="shadow-sm">
          <CardContent className="py-8 sm:py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium text-sm sm:text-base">Loading reports...</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">Fetching the latest user reports</p>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <FontAwesomeIcon icon={faFlag} className="text-red-600 text-lg" />
          </div>
          <div>
            <h3 className="text-slate-800 text-lg sm:text-xl font-semibold leading-tight tracking-tight">
              User Reports & Complaints
            </h3>
            <p className="text-slate-600 text-sm">Manage user reports and take appropriate actions</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={fetchReports}
          className="flex items-center gap-2 hover:bg-red-50 hover:border-red-300 w-full sm:w-auto"
          disabled={loading}
        >
          <FontAwesomeIcon icon={faRefresh} className={`${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{reportStats.total}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total Reports</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500 hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">{reportStats.pending}</div>
            <div className="text-xs sm:text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-gray-500 hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold text-gray-600">{reportStats.ignored}</div>
            <div className="text-xs sm:text-sm text-gray-600">Ignored</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold text-red-600">{reportStats.removed}</div>
            <div className="text-xs sm:text-sm text-gray-600">Removed</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div>
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
            {[
              { key: 'all', label: `All Reports (${reportStats.total})` },
              { key: 'pending', label: `Pending (${reportStats.pending})` },
              { key: 'ignored', label: `Ignored (${reportStats.ignored})` },
              { key: 'removed', label: `Removed Users (${reportStats.removed})` }
            ].map((tab) => (
              <button
                key={tab.key}
                className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                  statusFilter === tab.key
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
                onClick={() => setStatusFilter(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Reports Table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          {filteredReports.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="bg-gray-100 rounded-full p-4 sm:p-6 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 flex items-center justify-center">
                <FontAwesomeIcon icon={faFlag} className="text-3xl sm:text-4xl text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No reports found</h3>
              <p className="text-gray-500 max-w-sm mx-auto text-sm sm:text-base px-4">
                {statusFilter === 'all' 
                  ? 'No user reports have been submitted for this group yet. This is a good sign that your community is respectful!'
                  : statusFilter === 'removed'
                  ? 'No users have been removed based on reports yet.'
                  : `No reports with status "${statusFilter}" found.`
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-slate-600 text-xs sm:text-sm font-semibold">Reporter</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-slate-600 text-xs sm:text-sm font-semibold">Reported User</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-slate-600 text-xs sm:text-sm font-semibold hidden md:table-cell">Reason</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-slate-600 text-xs sm:text-sm font-semibold hidden lg:table-cell">Date</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-slate-600 text-xs sm:text-sm font-semibold">Status</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-slate-600 text-xs sm:text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-800 text-sm">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-xs">
                              {report.reporter?.username?.charAt(0)?.toUpperCase() || 'R'}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate text-xs sm:text-sm">{report.reporter?.username || 'Unknown Reporter'}</div>
                            <div className="text-xs text-gray-500 truncate hidden sm:block">@{report.reporter?.username || 'unknown'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-800 text-sm">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-600 font-semibold text-xs">
                              {report.reportedUser?.username?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate text-xs sm:text-sm">{report.reportedUser?.username || 'Unknown User'}</div>
                            <div className="text-xs text-gray-500 truncate hidden sm:block">@{report.reportedUser?.username || 'unknown'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-600 text-sm hidden md:table-cell">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                          {getReasonLabel(report.reason)}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-500 text-sm hidden lg:table-cell">
                        <div>
                          <div className="text-xs sm:text-sm">{new Date(report.created_at).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-400">
                            {new Date(report.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        {getStatusBadge(report.status)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetail(report)}
                          className="text-xs hover:bg-blue-50 hover:border-blue-300 px-2 sm:px-3"
                        >
                          <FontAwesomeIcon icon={faEye} className="mr-1" />
                          <span className="hidden sm:inline">View Details</span>
                          <span className="sm:hidden">View</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FontAwesomeIcon icon={faFlag} className="text-red-500" />
              Report Details
            </DialogTitle>
            <DialogDescription>
              Report #{selectedReport?.id} • Submitted on {selectedReport && new Date(selectedReport.created_at).toLocaleDateString()} at {selectedReport && new Date(selectedReport.created_at).toLocaleTimeString()}
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6">
              {/* Report Status */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-slate-600" />
                  <span className="font-semibold text-slate-700">Current Status:</span>
                </div>
                {getStatusBadge(selectedReport.status)}
              </div>

              {/* Users Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    Reporter
                  </h4>
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {selectedReport.reporter?.username?.charAt(0)?.toUpperCase() || 'R'}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-blue-900">{selectedReport.reporter?.username || 'Unknown Reporter'}</div>
                        <div className="text-sm text-blue-700">@{selectedReport.reporter?.username || 'unknown'}</div>
                      </div>
                    </div>
                    <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      User ID: {selectedReport.reporter?.user_id || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    Reported User
                  </h4>
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-semibold">
                          {selectedReport.reportedUser?.username?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-red-900">{selectedReport.reportedUser?.username || 'Unknown User'}</div>
                        <div className="text-sm text-red-700">@{selectedReport.reportedUser?.username || 'unknown'}</div>
                      </div>
                    </div>
                    <div className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                      User ID: {selectedReport.reportedUser?.user_id || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500" />
                    Reason for Report
                  </h4>
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {getReasonLabel(selectedReport.reason)}
                      </span>
                      <span className="text-yellow-600 text-sm">
                        ({selectedReport.reason})
                      </span>
                    </div>
                  </div>
                </div>

                {selectedReport.description && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Additional Details</h4>
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {selectedReport.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Group Information */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Group Context</h4>
                <div className="text-sm text-gray-600">
                  <div><strong>Group:</strong> {selectedReport.studyGroup?.name || 'Unknown Group'}</div>
                  <div><strong>Group Code:</strong> {selectedReport.studyGroup?.groupCode || 'N/A'}</div>
                </div>
              </div>

              {/* Reviewer Information */}
              {selectedReport.reviewer && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Reviewed By
                  </h4>
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-semibold text-sm">
                          {selectedReport.reviewer?.fullName?.charAt(0)?.toUpperCase() || 'R'}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-green-900">{selectedReport.reviewer?.fullName || 'Unknown Reviewer'}</div>
                        <div className="text-sm text-green-700">@{selectedReport.reviewer?.username || 'unknown'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Actions Note */}
              <div className="border-t pt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-blue-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-blue-800 mb-1">Admin Guidelines</p>
                      <p className="text-blue-700 leading-relaxed">
                        As a group admin, carefully review this report and consider the context. You can take appropriate actions 
                        such as warning the user, removing them from the group, or dismissing the report if it's unfounded. 
                        Always maintain fairness and transparency in your decisions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-2">
              {selectedReport?.status === 'pending' && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={handleIgnoreReport}
                    className="flex items-center gap-2 hover:bg-gray-50"
                  >
                    <FontAwesomeIcon icon={faEyeSlash} className="text-sm" />
                    Ignore Report
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleRemoveUser}
                    className="flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-sm" />
                    Remove User
                  </Button>
                </>
              )}
            </div>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove User Confirmation Modal */}
      <Dialog open={showRemoveConfirmation} onOpenChange={setShowRemoveConfirmation}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              Remove User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <strong>{selectedReport?.reportedUser.username}</strong> from the group? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowRemoveConfirmation(false)}
              disabled={isRemoving}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmRemoveUser}
              disabled={isRemoving}
              className="flex items-center gap-2"
            >
              {isRemoving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              {isRemoving ? 'Removing...' : 'Yes, Remove'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ComplaintsSection;
