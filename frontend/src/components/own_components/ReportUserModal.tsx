import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { reportUserAPI } from "@/services/UserServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

interface ReportUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupCode: string;
  reportedUserId: number;
  reportedUserName: string;
}

const ReportUserModal: React.FC<ReportUserModalProps> = ({
  isOpen,
  onClose,
  groupCode,
  reportedUserId,
  reportedUserName,
}) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validReasons = [
    { value: "inappropriate_behavior", label: "Inappropriate Behavior" },
    { value: "harassment", label: "Harassment" },
    { value: "spam", label: "Spam" },
    { value: "offensive_content", label: "Offensive Content" },
    { value: "violation_of_rules", label: "Violation of Rules" },
    { value: "fake_profile", label: "Fake Profile" },
    { value: "academic_dishonesty", label: "Academic Dishonesty" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason) {
      toast.error("Please select a reason for reporting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const reportData = {
        reason,
        description: description.trim() || undefined,
      };

      const response = await reportUserAPI(
        groupCode,
        reportedUserId,
        reportData
      );

      if (response.data.success) {
        toast.success(
          "User reported successfully. Group admins will review the report."
        );
        handleClose();
      } else {
        toast.error(response.data.message || "Failed to submit report.");
      }
    } catch (error: any) {
      console.error("Error reporting user:", error);
      toast.error(error.response?.data?.message || "Failed to submit report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason("");
    setDescription("");
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <FontAwesomeIcon icon={faFlag} />
            Report User
          </DialogTitle>
          <DialogDescription>
            You are reporting <strong>{reportedUserName}</strong>. Please
            provide a reason for this report.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Reason for Report <span className="text-red-500">*</span>
            </Label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a reason...</option>
              {validReasons.map((reasonOption) => (
                <option key={reasonOption.value} value={reasonOption.value}>
                  {reasonOption.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Additional Details (Optional)
            </Label>
            <textarea
              id="description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              placeholder="Provide additional context or details about the issue..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500">
              {description.length}/500 characters
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> False reports may result in action against
              your account. Please ensure your report is legitimate and based on
              actual violations.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isSubmitting || !reason}
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2">Submitting...</span>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faFlag} className="mr-2" />
                  Submit Report
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportUserModal;
