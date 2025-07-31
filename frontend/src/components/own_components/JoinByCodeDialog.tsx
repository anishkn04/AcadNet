import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { useData } from '@/hooks/userInfoContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface JoinByCodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const JoinByCodeDialog: React.FC<JoinByCodeDialogProps> = ({ isOpen, onClose }) => {
  const [groupCode, setGroupCode] = useState('');
  const [joinAsAnonymous, setJoinAsAnonymous] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const { joinGroup } = useData();
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!groupCode.trim()) {
      toast.error('Please enter a group code');
      return;
    }

    // Validate group code format (6 alphanumeric characters)
    const codeRegex = /^[A-Z0-9]{6}$/;
    if (!codeRegex.test(groupCode.toUpperCase())) {
      toast.error('Group code must be 6 characters long and contain only letters and numbers');
      return;
    }

    setIsJoining(true);
    try {
      const result = await joinGroup(groupCode.toUpperCase(), joinAsAnonymous);
      if (result.success) {
        toast.success(`Successfully joined group${joinAsAnonymous ? ' as anonymous' : ''}!`);
        onClose();
        setGroupCode('');
        setJoinAsAnonymous(false);
        // Redirect to the group page
        navigate(`/group?code=${groupCode.toUpperCase()}`);
      } else {
        toast.error(`Failed to join group: ${result.message}`);
      }
    } catch (error) {
      console.error('Join group error:', error);
      toast.error('An error occurred while joining the group. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleClose = () => {
    if (!isJoining) {
      onClose();
      setGroupCode('');
      setJoinAsAnonymous(false);
    }
  };

  const formatGroupCode = (value: string) => {
    // Remove any non-alphanumeric characters and convert to uppercase
    return value.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 6);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatGroupCode(e.target.value);
    setGroupCode(formatted);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Group by Code</DialogTitle>
          <DialogDescription>
            Enter a 6-character group code to join a private group or any group directly.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="groupCode">Group Code</Label>
            <Input
              id="groupCode"
              type="text"
              placeholder="ABC123"
              value={groupCode}
              onChange={handleInputChange}
              className="text-center text-lg font-mono tracking-widest uppercase"
              maxLength={6}
              disabled={isJoining}
            />
            <p className="text-xs text-gray-500">
              Group codes are 6 characters long (letters and numbers only)
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="joinAsAnonymous"
              checked={joinAsAnonymous}
              onCheckedChange={setJoinAsAnonymous}
              disabled={isJoining}
            />
            <label 
              htmlFor="joinAsAnonymous" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Join as anonymous
            </label>
          </div>
          <p className="text-xs text-gray-500">
            When joining as anonymous, your username will be displayed as "Anonymous" to other members in this group.
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isJoining}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleJoin}
            disabled={isJoining || !groupCode.trim()}
            className="w-full sm:w-auto"
          >
            {isJoining ? 'Joining...' : 'Join Group'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinByCodeDialog;
