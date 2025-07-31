// Example integration of Resource Reporting into existing components
// This shows how to add the report functionality to resource lists

import React, { useState } from 'react';
import { reportResourceAPI } from '@/services/UserServices';
import { toast } from 'react-toastify';

// Report Resource Modal Component
export const ReportResourceModal = ({ 
  isOpen, 
  onClose, 
  groupCode, 
  resourceId, 
  resourceName,
  onReportSuccess 
}: {
  isOpen: boolean;
  onClose: () => void;
  groupCode: string;
  resourceId: number;
  resourceName: string;
  onReportSuccess: () => void;
}) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons = [
    { value: 'offensive_content', label: 'Offensive Content' },
    { value: 'spam', label: 'Spam' },
    { value: 'harassment', label: 'Harassment' },
    { value: 'violation_of_rules', label: 'Violation of Rules' },
    { value: 'academic_dishonesty', label: 'Academic Dishonesty' },
    { value: 'inappropriate_behavior', label: 'Inappropriate Behavior' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason) {
      toast.error('Please select a reason for reporting.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const reportData = {
        reason,
        description: description.trim() || undefined
      };
      
      await reportResourceAPI(groupCode, resourceId, reportData);
      toast.success('Resource reported successfully. It will be reviewed by group admins.');
      onReportSuccess();
      handleClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to report resource');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setDescription('');
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
              <span className="material-icons-outlined">flag</span>
              Report Resource
            </h2>
            <button
              onClick={handleClose}
              className="text-slate-500 hover:text-slate-700"
              disabled={isSubmitting}
            >
              <span className="material-icons-outlined">close</span>
            </button>
          </div>

          <p className="text-slate-600 mb-4">
            You are reporting <strong>{resourceName}</strong>. Please provide a reason for this report.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Reason for reporting *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
                disabled={isSubmitting}
              >
                <option value="">Select a reason...</option>
                {reportReasons.map(reasonOption => (
                  <option key={reasonOption.value} value={reasonOption.value}>
                    {reasonOption.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Additional details (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide additional context about why you're reporting this resource..."
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                maxLength={500}
                disabled={isSubmitting}
              />
              <p className="text-xs text-slate-500 mt-1">
                {description.length}/500 characters
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Reporting this resource will temporarily remove it from the group 
                until an admin reviews your report. False reports may result in action against your account.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-icons-outlined animate-spin text-sm">refresh</span>
                    Reporting...
                  </>
                ) : (
                  <>
                    <span className="material-icons-outlined text-sm">flag</span>
                    Report Resource
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Enhanced Resource List Item with Report Button
export const ResourceListItemWithReport = ({ 
  resource, 
  groupCode, 
  currentUserId,
  isGroupMember,
  onResourceReported 
}: {
  resource: any;
  groupCode: string;
  currentUserId: string;
  isGroupMember: boolean;
  onResourceReported: (resourceId: number) => void;
}) => {
  const [showReportModal, setShowReportModal] = useState(false);

  // Check if user can report this resource
  const canReport = isGroupMember && 
                    resource.uploadedBy !== currentUserId && 
                    resource.status === 'approved';

  const handleReportSuccess = () => {
    onResourceReported(resource.id);
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <span className="material-icons-outlined text-blue-600">
              {resource.fileType === 'pdf' ? 'picture_as_pdf' : 'description'}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-slate-800">
              {resource.fileName || 'Unnamed Resource'}
            </h3>
            <p className="text-sm text-slate-500">
              Uploaded on {new Date(resource.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View/Download Button */}
          <button
            className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50"
            title="View Resource"
          >
            <span className="material-icons-outlined">visibility</span>
          </button>

          {/* Report Button - only show if user can report */}
          {canReport && (
            <button
              onClick={() => setShowReportModal(true)}
              className="p-2 text-orange-500 hover:text-orange-700 rounded-lg hover:bg-orange-50"
              title="Report Resource"
            >
              <span className="material-icons-outlined">flag</span>
            </button>
          )}
        </div>
      </div>

      {/* Report Modal */}
      <ReportResourceModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        groupCode={groupCode}
        resourceId={resource.id}
        resourceName={resource.fileName || 'Unnamed Resource'}
        onReportSuccess={handleReportSuccess}
      />
    </>
  );
};

// Usage example in a group resources page
export const GroupResourcesPageExample = () => {
  const [resources, setResources] = useState([]);
  const groupCode = "ABC123"; // from props/params
  const currentUserId = "user123"; // from auth context
  const isGroupMember = true; // from group membership check

  const handleResourceReported = (resourceId: number) => {
    // Remove the reported resource from the list since it's now pending
    setResources(prev => prev.filter((resource: any) => resource.id !== resourceId));
    
    // Optionally show a success message
    toast.info('Resource has been reported and removed from view pending admin review.');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-800">Group Resources</h2>
      
      <div className="grid gap-4">
        {resources.map((resource: any) => (
          <ResourceListItemWithReport
            key={resource.id}
            resource={resource}
            groupCode={groupCode}
            currentUserId={currentUserId}
            isGroupMember={isGroupMember}
            onResourceReported={handleResourceReported}
          />
        ))}
      </div>
    </div>
  );
};

// Utility functions for resource reporting
export const ResourceReportingUtils = {
  
  // Check if user can report a resource
  canUserReportResource: (
    userId: string, 
    resource: any, 
    isGroupMember: boolean
  ): boolean => {
    return isGroupMember && 
           resource.uploadedBy !== userId && 
           resource.status === 'approved';
  },

  // Handle resource reporting with error handling
  handleResourceReport: async (
    groupCode: string,
    resourceId: number,
    reportData: { reason: string; description?: string }
  ) => {
    try {
      const result = await reportResourceAPI(groupCode, resourceId, reportData);
      toast.success('Resource reported successfully!');
      return result;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to report resource';
      toast.error(message);
      throw error;
    }
  }
};
