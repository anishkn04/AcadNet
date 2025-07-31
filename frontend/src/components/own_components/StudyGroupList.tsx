import React, { useState, useEffect } from 'react';
import { useData } from '@/hooks/userInfoContext';
import type { Groups } from '@/models/User';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { useNavigate, Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import SuccessModal from '../ui/success-modal';
import ErrorModal from '../ui/error-modal';
import { Search } from 'lucide-react';

interface StudyGroupListProps {
  search: string;
  subject: string;
  course: string;
  timeSlot: string;
}

const StudyGroupList: React.FC<StudyGroupListProps> = ({
  search,
  subject,
  course,
  timeSlot,
}) => {
  const [groups, setGroups] = useState<Groups[]>([]);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Groups | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [joinAsAnonymous, setJoinAsAnonymous] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successGroupCode, setSuccessGroupCode] = useState(''); // Store group code for navigation
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { retreiveGroups, userId, joinGroup } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    const groupList = async () => {
      const data = await retreiveGroups();
      if (Array.isArray(data)) {
        setGroups(data);
      } else {
        setGroups([]);
      }
    };
    groupList();
  }, [retreiveGroups]);

  // Filtering logic (adjust field names as needed)
  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(search.toLowerCase()) ||
      (group.description && group.description.toLowerCase().includes(search.toLowerCase()));
    // These fields are placeholders; replace with your actual group fields if available
    const matchesSubject = subject ? group.name.toLowerCase().includes(subject.toLowerCase()) : true;
    const matchesCourse = course ? group.name.toLowerCase().includes(course.toLowerCase()) : true;
    const matchesTimeSlot = timeSlot ? group.name.toLowerCase().includes(timeSlot.toLowerCase()) : true;
    return matchesSearch && matchesSubject && matchesCourse && matchesTimeSlot;
  });

  // Handler for entering a group you created
  const handleEnterGroup = (group: Groups) => {
    navigate(`/group?code=${group.groupCode}`);
  };

  // Handler for viewing a group overview
  const handleViewGroup = (group: Groups) => {
    navigate(`/overview?code=${group.groupCode}`);
  };

  // Handler for showing join confirmation dialog
  const handleJoinGroupClick = (group: Groups) => {
    setSelectedGroup(group);
    setShowJoinDialog(true);
  };

  // Handler for confirming group join
  const handleConfirmJoin = async () => {
    if (!selectedGroup) return;
    
    setIsJoining(true);
    try {
      const result = await joinGroup(selectedGroup.groupCode, joinAsAnonymous);
      if (result.success) {
        // Store group code for navigation after modal closes
        setSuccessGroupCode(selectedGroup.groupCode);
        
        // Close the join dialog first
        setShowJoinDialog(false);
        setSelectedGroup(null);
        setJoinAsAnonymous(false); // Reset the checkbox
        
        // Show success modal with custom message
        const message = `Successfully joined "${selectedGroup.name}"${joinAsAnonymous ? ' as anonymous' : ''}!`;
        setSuccessMessage(message);
        setShowSuccessModal(true);
        
        // Refresh the groups list to update UI
        setIsRefreshing(true);
        const data = await retreiveGroups();
        if (Array.isArray(data)) {
          setGroups(data);
        }
        setIsRefreshing(false);
      } else {
        setErrorMessage(`Failed to join group: ${result.message}`);
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Join group error:', error);
      setErrorMessage('An error occurred while joining the group. Please try again.');
      setShowErrorModal(true);
    } finally {
      setIsJoining(false);
    }
  };

  // Handler for canceling join
  const handleCancelJoin = () => {
    setShowJoinDialog(false);
    setSelectedGroup(null);
    setJoinAsAnonymous(false); // Reset the checkbox
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Available Groups ({filteredGroups.length})
          {isRefreshing && <span className="text-sm text-slate-500 ml-2 font-normal">Refreshing...</span>}
        </h2>
        <p className="text-slate-600">
          Browse through available study groups and find the perfect match for your learning goals.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => {
            const isCreator = group?.creatorId === userId;
            // Check if current user is a member of this group
            const isMember = group?.members?.some(member => Number(member.userId) === Number(userId));
            
            return (
              <Card key={group.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900 line-clamp-1">
                    {group?.name}
                  </CardTitle>
                  <CardDescription className="text-slate-600 line-clamp-2 min-h-[2.5rem]">
                    {group?.description || "No description available"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded font-mono">
                      Code: {group?.groupCode}
                    </div>
                    {isCreator || isMember ? (
                      <Button 
                        onClick={() => handleEnterGroup(group)}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                      >
                        Enter Group
                      </Button>
                    ) : (
                      <div className='flex gap-2 flex-col sm:flex-row'>
                        <Button 
                          onClick={() => handleViewGroup(group)}
                          variant="outline"
                          className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
                        >
                          View Details
                        </Button>
                        <Button 
                          onClick={() => handleJoinGroupClick(group)}
                          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
                        >
                          Join Group
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-slate-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No groups found</h3>
            <p className="text-slate-500 mb-4">
              {search ? 
                "No groups match your search criteria. Try adjusting your search terms." :
                "No study groups are available at the moment. Be the first to create one!"
              }
            </p>
            {!search && (
              <Link to="/create">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                  Create First Group
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Join Group Confirmation Dialog */}
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent >
          <DialogHeader>
            <DialogTitle>Join Study Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to join "{selectedGroup?.name}"?
            </DialogDescription>
          </DialogHeader>
          {selectedGroup && (
            <div className="py-4">
              <div className="text-sm text-gray-600 mb-2">
                <strong>Group:</strong> {selectedGroup.name}
              </div>
              {selectedGroup.description && (
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Description:</strong> {selectedGroup.description}
                </div>
              )}
              <div className="text-sm text-gray-600 mb-4">
                <strong>Group Code:</strong> {selectedGroup.groupCode}
              </div>
              
              {/* Anonymous Join Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="joinAsAnonymous"
                  checked={joinAsAnonymous}
                  onCheckedChange={setJoinAsAnonymous}
                />
                <label 
                  htmlFor="joinAsAnonymous" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Join as anonymous
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                When joining as anonymous, your username will be displayed as "Anonymous" to other members in this group.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={handleCancelJoin}
              disabled={isJoining}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmJoin}
              disabled={isJoining}
            >
              {isJoining ? 'Joining...' : 'Join Group'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
        autoCloseDelay={2500} // 2.5 seconds
        onAutoClose={() => {
          // Navigate to the group after the modal closes
          if (successGroupCode) {
            navigate(`/group?code=${successGroupCode}`);
            setSuccessGroupCode(''); // Clear the stored code
          }
        }}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    </>
  );
};

export default StudyGroupList;