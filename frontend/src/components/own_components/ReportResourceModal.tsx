import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import { reportResourceAPI } from '@/services/UserServices';
import { toast } from 'react-toastify';

interface ReportResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupCode: string;
  resourceId: number;
  resourceName: string;
}

const ReportResourceModal: React.FC<ReportResourceModalProps> = ({
  isOpen,
  onClose,
  groupCode,
  resourceId,
  resourceName
}) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validReasons = [
    { value: 'inappropriate_behavior', label: 'Inappropriate Behavior' },
    { value: 'harassment', label: 'Harassment' },
    { value: 'spam', label: 'Spam' },
    { value: 'offensive_content', label: 'Offensive Content' },
    { value: 'violation_of_rules', label: 'Violation of Rules' },
    { value: 'fake_profile', label: 'Fake Profile' },
    { value: 'academic_dishonesty', label: 'Academic Dishonesty' },
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
      
      const response = await reportResourceAPI(groupCode, resourceId, reportData);
      
      if (response.data.success) {
        toast.success('Resource reported successfully. Group admins will review the report.');
        handleClose();
      } else {
        toast.error(response.data.message || 'Failed to submit report.');
      }
    } catch (error: any) {
      console.error('Error reporting resource:', error);
      toast.error(error.response?.data?.message || 'Failed to submit report.');
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <FontAwesomeIcon icon={faFlag} />
            Report Resource
          </DialogTitle>
          <DialogDescription>
            You are reporting <strong>{resourceName}</strong>. Please provide a reason for this report.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Report *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {validReasons.map((reasonOption) => (
                  <SelectItem key={reasonOption.value} value={reasonOption.value}>
                    {reasonOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Additional Details (Optional)</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder="Provide additional context about why you're reporting this resource..."
              rows={4}
              maxLength={500}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500">
              {description.length}/500 characters
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !reason}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? 'Reporting...' : 'Submit Report'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportResourceModal;
