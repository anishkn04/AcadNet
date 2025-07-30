import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { fetchOverviewAPI } from '@/services/UserServices';
import { useData } from '@/hooks/userInfoContext';

const Overview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [joinAsAnonymous, setJoinAsAnonymous] = useState(false);
  const { userId, joinGroup } = useData();
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  // Get group code from URL
  const params = new URLSearchParams(location.search);
  const groupCode = params.get('code');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (groupCode) {
        try {
          const {data,status} = await fetchOverviewAPI(groupCode)
          if(status === 200){
            console.log(data)
            setGroup(data)
          }
        } catch (error) {
          console.error('Error fetching group overview:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchData();
  }, [groupCode]);

  // Handler for showing join confirmation dialog
  const handleJoinGroupClick = (group: any) => {
    setSelectedGroup(group);
    setShowJoinDialog(true);
  };

  // Handler for confirming group join
  const handleConfirmJoin = async () => {
    if (!selectedGroup || !groupCode) return;
    
    setIsJoining(true);
    try {
      // Use the groupCode from the URL since the overview API doesn't return groupCode
      const result = await joinGroup(groupCode, joinAsAnonymous); // Add joinAsAnonymous parameter
      if (result.success) {
        alert(`Successfully joined "${selectedGroup.groupCode}"${joinAsAnonymous ? ' as anonymous' : ''}!`);
        setShowJoinDialog(false);
        setSelectedGroup(null);
        setJoinAsAnonymous(false); // Reset the checkbox
        
        // Optionally redirect to the group
        navigate(`/group?code=${groupCode}`); // Use groupCode from URL
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
    setJoinAsAnonymous(false); // Reset the checkbox
  };

  

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  if (!group) {
    return <div className="flex justify-center items-center h-64">Group not found.</div>;
  }

  // File counts by type and display
  const fileCounts = group.fileCounts || {};
  const totalFiles = group.totalFiles || 0;

  // Debug logging
  // console.log('Group object structure:', group);
  // console.log('Creator info:', {
  //   creatorName: group.creatorName,
  //   UserModel: group.UserModel,
  //   fullName: group.UserModel?.fullName,
  //   username: group.UserModel?.username
  // });
  // console.log('File info:', {
  //   fileCounts,
  //   totalFiles,
  //   AdditionalResources: group.AdditionalResources
  // });
  // console.log('Syllabus info:', {
  //   syllabus: group.syllabus,
  //   topics: group.syllabus?.topics
  // });

  // Check if current user is a member of this group
  const isCreator = group?.creatorId === userId;
  const isMember = group?.members?.some((member: any) => Number(member.userId) === Number(userId));
  const showJoinButton = !isCreator && !isMember;

  return (
    <div className="container mx-auto p-8">
      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{group.name || 'Group Name'}</CardTitle>
          <CardDescription>{group.description || 'No description available'}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6 items-center">
            <div>
              <span className="font-semibold">Creator:</span> {
                group.creatorName || 
                group.UserModel?.fullName || 
                group.UserModel?.username || 
                'Creator information not available'
              }
            </div>
            <div>
              <span className="font-semibold">Members:</span> {group.membersCount || 0}
            </div>
            <div>
              <span className="font-semibold">Files:</span> {totalFiles}
            </div>
            {Object.keys(fileCounts).length > 0 && (
              <div className="flex gap-2">
                <span className="text-sm text-gray-600">File types:</span>
                {Object.entries(fileCounts).map(([type, count]) => (
                  <span key={type} className="inline-flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {type.toUpperCase()}: {String(count)}
                  </span>
                ))}
              </div>
            )}
            {totalFiles === 0 && (
              <div className="text-sm text-gray-500">
                No files uploaded yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Syllabus</CardTitle>
        </CardHeader>
        <CardContent>
          {group.syllabus?.topics && group.syllabus.topics.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 bg-white rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b">Topic</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b">Description</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b">Subtopics</th>
                  </tr>
                </thead>
                <tbody className='border-2'>
                  {(() => {
                    // Sort topics by created_at to maintain the original order from creation
                    const sortedTopics = [...group.syllabus.topics].sort((a: any, b: any) => {
                      const dateA = new Date(a.created_at || 0);
                      const dateB = new Date(b.created_at || 0);
                      return dateA.getTime() - dateB.getTime();
                    });
                    
                    return sortedTopics.map((topic: any) => (
                      <tr key={topic.id} className="border-b hover:bg-blue-50">
                        <td className="px-4 py-2 font-medium text-gray-900 align-top">{topic.title}</td>
                        <td className="px-4 py-2 text-gray-600 align-top">{topic.description || '-'}</td>
                        <td className="px-4 py-2 align-top">
                          {topic.subTopics && topic.subTopics.length > 0 ? (
                            <ul className="list-disc ml-4">
                              {(() => {
                                // Sort subtopics by created_at to maintain the original order from creation
                                const sortedSubTopics = [...topic.subTopics].sort((a: any, b: any) => {
                                  const dateA = new Date(a.created_at || 0);
                                  const dateB = new Date(b.created_at || 0);
                                  return dateA.getTime() - dateB.getTime();
                                });
                                
                                return sortedSubTopics.map((subtopic: any) => (
                                  <li key={subtopic.id} className="mb-1">
                                    <span className="font-semibold text-blue-700">{subtopic.title}</span>
                                    {subtopic.content && (
                                      <span className="text-gray-500 ml-1">({subtopic.content})</span>
                                    )}
                                  </li>
                                ));
                              })()}
                            </ul>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Syllabus not available.</p>
          )}
        </CardContent>
      </Card>
      {showJoinButton && (
        <div className="flex justify-end">
          <Button 
            onClick={() => handleJoinGroupClick(groupCode)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg px-6 py-3 text-lg font-semibold"
            size="lg"
          >
            Join Group
          </Button>
        </div>
      )}

      {/* Join Group Button - Fixed position bottom right, only show if not member */}

      {/* Join Group Confirmation Dialog */}
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent>
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
                <strong>Group Code:</strong> {groupCode}
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
    </div>
  );
};

export default Overview;
