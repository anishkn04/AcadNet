import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

interface DeleteAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

const DeleteAccountDialog = ({ isOpen, onClose, onConfirm, isDeleting }: DeleteAccountDialogProps) => {
  const [confirmText, setConfirmText] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirmChange = (value: string) => {
    setConfirmText(value);
    setIsConfirmed(value === 'DELETE MY ACCOUNT');
  };

  const handleConfirm = async () => {
    if (isConfirmed) {
      await onConfirm();
      setConfirmText('');
      setIsConfirmed(false);
    }
  };

  const handleClose = () => {
    setConfirmText('');
    setIsConfirmed(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Account
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            This action cannot be undone. This will permanently delete your account and all associated data.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-red-800 font-medium mb-2">What will be deleted:</h4>
            <ul className="text-red-700 text-sm space-y-1">
              <li>• Your profile and personal information</li>
              <li>• All study groups you created</li>
              <li>• Your membership in other groups</li>
              <li>• All uploaded resources and files</li>
              <li>• Forum posts and replies</li>
              <li>• All likes and interactions</li>
              <li>• Reports and notifications</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-text" className="text-slate-700">
              Type <span className="font-mono bg-slate-100 px-1 rounded">DELETE MY ACCOUNT</span> to confirm:
            </Label>
            <Input
              id="confirm-text"
              value={confirmText}
              onChange={(e) => handleConfirmChange(e.target.value)}
              placeholder="DELETE MY ACCOUNT"
              className="font-mono"
              disabled={isDeleting}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmed || isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountDialog;
