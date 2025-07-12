import React, { useState, useEffect } from 'react';
import { useData } from '@/hooks/userInfoContext';
import type { Groups } from '@/models/User';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';

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
  }, []);

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
      const result = await joinGroup(selectedGroup.groupCode);
      if (result.success) {
        alert(`Successfully joined "${selectedGroup.name}"!`);
        setShowJoinDialog(false);
        setSelectedGroup(null);
        
        // Refresh the groups list to update UI
        setIsRefreshing(true);
        const data = await retreiveGroups();
        if (Array.isArray(data)) {
          setGroups(data);
        }
        setIsRefreshing(false);
        
        // Optionally redirect to the group
        navigate(`/group?code=${selectedGroup.groupCode}`);
      } else {
        alert(`Failed to join group: ${result.message}`);
      }
    } catch (error) {
      console.error('Join group error:', error);
      alert('An error occurred while joining the group. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  // Handler for canceling join
  const handleCancelJoin = () => {
    setShowJoinDialog(false);
    setSelectedGroup(null);
  };

  return (
    <>
      <h2 className="text-[#101518]  text-xl font-semibold leading-tight tracking-[-0.015em] px-4 ">
        Available Groups ({filteredGroups.length}) {isRefreshing && <span className="text-sm text-gray-500 ml-2">Refreshing...</span>}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => {
            const isCreator = group?.creatorId === userId;
            // Check if current user is a member of this group
            const isMember = group?.members?.some(member => Number(member.userId) === Number(userId));
            
      
            
            return (
              <Card key={group.id}>
                <CardHeader>
                  <CardTitle>
                    {group?.name}
                  </CardTitle>
                  <CardDescription>
                    {group?.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isCreator || isMember ? (
                    <Button onClick={() => handleEnterGroup(group)}>Enter Group</Button>
                  ) : (
                    <div className='flex gap-2 flex-col sm:flex-row'>
                      <Button onClick={() => handleViewGroup(group)}>View</Button>
                      <Button onClick={() => handleJoinGroupClick(group)}>Join Group</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <p className="px-4">No groups available at the moment.</p>
        )}
      </div>

      {/* Join Group Confirmation Dialog */}
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent onClose={handleCancelJoin}>
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
              <div className="text-sm text-gray-600">
                <strong>Group Code:</strong> {selectedGroup.groupCode}
              </div>
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
    </>
  );
};

export default StudyGroupList;