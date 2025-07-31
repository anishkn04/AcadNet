// Test file for Resource Reporting API
// This file demonstrates how to use the new resource reporting functionality

import { reportResourceAPI } from '../services/UserServices';

export const ResourceReportingTests = {

  // Test reporting a resource with valid data
  testReportResource: async (groupCode: string, resourceId: number) => {
    const reportData = {
      reason: 'offensive_content',
      description: 'This resource contains inappropriate material that violates group guidelines.'
    };

    try {
      console.log(`Testing resource reporting for group ${groupCode}, resource ${resourceId}`);
      const result = await reportResourceAPI(groupCode, resourceId, reportData);
      console.log('✅ Resource reported successfully:', result.data);
      return result;
    } catch (error: any) {
      console.error('❌ Resource reporting failed:', error.response?.data?.message || error.message);
      throw error;
    }
  },

  // Test reporting with different reasons
  testDifferentReasons: async (groupCode: string, resourceId: number) => {
    const reasons = [
      { reason: 'spam', description: 'This is spam content' },
      { reason: 'harassment', description: 'Contains harassing content' },
      { reason: 'violation_of_rules', description: 'Violates group rules' },
      { reason: 'academic_dishonesty', description: 'Promotes cheating' },
      { reason: 'other', description: 'Other policy violation' }
    ];

    for (const reportData of reasons) {
      try {
        console.log(`Testing report with reason: ${reportData.reason}`);
        const result = await reportResourceAPI(groupCode, resourceId, reportData);
        console.log(`✅ Successfully reported with reason '${reportData.reason}':`, result.data);
      } catch (error: any) {
        console.error(`❌ Failed to report with reason '${reportData.reason}':`, error.response?.data?.message);
      }
    }
  },

  // Test edge cases and error scenarios
  testErrorScenarios: async (groupCode: string, resourceId: number) => {
    // Test with invalid reason
    try {
      console.log('Testing invalid reason');
      await reportResourceAPI(groupCode, resourceId, { 
        reason: 'invalid_reason' as any, 
        description: 'Test' 
      });
      console.log('⚠️  Unexpected success with invalid reason');
    } catch (error: any) {
      if (error.response?.status === 400) {
        console.log('✅ Correctly rejected invalid reason');
      } else {
        console.error('❌ Unexpected error with invalid reason:', error.response?.data?.message);
      }
    }

    // Test reporting non-existent resource
    try {
      console.log('Testing non-existent resource');
      await reportResourceAPI(groupCode, 999999, { 
        reason: 'spam', 
        description: 'Test' 
      });
      console.log('⚠️  Unexpected success with non-existent resource');
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log('✅ Correctly rejected non-existent resource');
      } else {
        console.error('❌ Unexpected error with non-existent resource:', error.response?.data?.message);
      }
    }

    // Test duplicate reporting
    try {
      console.log('Testing duplicate reporting');
      // First report
      await reportResourceAPI(groupCode, resourceId, { 
        reason: 'spam', 
        description: 'First report' 
      });
      // Second report (should fail)
      await reportResourceAPI(groupCode, resourceId, { 
        reason: 'offensive_content', 
        description: 'Second report' 
      });
      console.log('⚠️  Unexpected success with duplicate report');
    } catch (error: any) {
      if (error.response?.status === 409) {
        console.log('✅ Correctly rejected duplicate report');
      } else {
        console.error('❌ Unexpected error with duplicate report:', error.response?.data?.message);
      }
    }
  },

  // Test minimal reporting (only reason)
  testMinimalReport: async (groupCode: string, resourceId: number) => {
    try {
      console.log('Testing minimal report (only reason)');
      const result = await reportResourceAPI(groupCode, resourceId, { 
        reason: 'spam'
      });
      console.log('✅ Minimal report successful:', result.data);
      return result;
    } catch (error: any) {
      console.error('❌ Minimal report failed:', error.response?.data?.message || error.message);
      throw error;
    }
  },

  // Test report without reason (should use default)
  testDefaultReason: async (groupCode: string, resourceId: number) => {
    try {
      console.log('Testing report without reason (should use default)');
      const result = await reportResourceAPI(groupCode, resourceId, { 
        description: 'Report without explicit reason'
      });
      console.log('✅ Default reason report successful:', result.data);
      return result;
    } catch (error: any) {
      console.error('❌ Default reason report failed:', error.response?.data?.message || error.message);
      throw error;
    }
  }
};

// Example usage in a React component:
export const ExampleReportingComponent = {
  
  // Report resource handler with confirmation
  handleReportResource: async (groupCode: string, resourceId: number, resourceName: string) => {
    const reasons = [
      { value: 'offensive_content', label: 'Offensive Content' },
      { value: 'spam', label: 'Spam' },
      { value: 'harassment', label: 'Harassment' },
      { value: 'violation_of_rules', label: 'Violation of Rules' },
      { value: 'academic_dishonesty', label: 'Academic Dishonesty' },
      { value: 'other', label: 'Other' }
    ];

    // In a real app, you'd show a modal/dialog here
    const reason = prompt(`Why are you reporting "${resourceName}"?\n\nOptions: ${reasons.map(r => r.label).join(', ')}`);
    if (!reason) return;

    const description = prompt('Please provide additional details (optional):') || '';

    const confirmed = window.confirm(
      `Are you sure you want to report "${resourceName}"?\n\n` +
      `This will temporarily remove the resource from the group until an admin reviews it.`
    );
    
    if (!confirmed) return;

    try {
      const result = await reportResourceAPI(groupCode, resourceId, {
        reason: reason.toLowerCase().replace(/\s+/g, '_'),
        description
      });
      
      alert('Resource reported successfully! It will be reviewed by group admins.');
      
      // Update UI to remove the resource from the current view
      // since it's now pending admin review
      
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to report resource';
      alert(`Error: ${errorMessage}`);
      console.error('Resource reporting error:', error);
    }
  },

  // Report button component example
  ReportButton: ({ groupCode, resourceId, resourceName, onReportSuccess }: any) => {
    const handleClick = async () => {
      try {
        await ExampleReportingComponent.handleReportResource(groupCode, resourceId, resourceName);
        if (onReportSuccess) {
          onReportSuccess(resourceId);
        }
      } catch (error) {
        // Error already handled in handleReportResource
      }
    };

    return (
      <button
        onClick={handleClick}
        className="p-1.5 text-orange-500 hover:text-orange-700 rounded-md hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
        title="Report Resource"
      >
        <span className="material-icons-outlined text-lg">flag</span>
      </button>
    );
  }
};

// Permission check utility
export const ResourceReportingUtils = {
  
  // Check if user can report a resource
  canReportResource: (userId: string, resourceUploadedBy: string, userRole: string) => {
    // Users cannot report their own resources
    if (userId === resourceUploadedBy) return false;
    
    // Only group members can report (role check depends on your membership system)
    if (!userRole || userRole === 'none') return false;
    
    return true;
  },

  // Get reporting reasons list
  getReportingReasons: () => [
    { value: 'inappropriate_behavior', label: 'Inappropriate Behavior' },
    { value: 'harassment', label: 'Harassment' },
    { value: 'spam', label: 'Spam' },
    { value: 'offensive_content', label: 'Offensive Content' },
    { value: 'violation_of_rules', label: 'Violation of Rules' },
    { value: 'fake_profile', label: 'Fake Profile' },
    { value: 'academic_dishonesty', label: 'Academic Dishonesty' },
    { value: 'other', label: 'Other' }
  ],

  // Format report data for API
  formatReportData: (reason: string, description: string) => ({
    reason: reason.trim(),
    description: description.trim() || undefined
  })
};
