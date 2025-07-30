import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchGroupDetailsByIdAPI } from '@/services/UserServices'
import type { Groups } from '@/models/User'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import Forum from '@/components/own_components/Forum'
import ResourcesSection from '@/components/own_components/ResourcesSection'
import { useData } from '@/hooks/userInfoContext'

const StudyPlatform = () => {
    const [groupData, setGroupData] = useState<Groups | null>(null)
    const [isLeaving, setIsLeaving] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const { leaveGroup, userId } = useData()

    // Get groupCode from URL
    const params = new URLSearchParams(location.search)
    const groupCode = params.get('code')

    // Helper function to determine member display based on visibility rules
    const getMemberDisplayInfo = (member: any, currentUserId: number, isCurrentUserCreator: boolean) => {
        const memberInfo = member.UserModel;
        const isAnonymous = member.isAnonymous;
        const isCurrentUser = member.userId === currentUserId;
        
        // Get actual member details
        const actualUsername = memberInfo?.username;
        const actualFullName = memberInfo?.fullName;
        
        let avatarInitials;
        let displayName;
        
        // Visibility rules:
        // 1. Creator can see everyone's real names
        // 2. Anonymous users can see their own real name
        // 3. Everyone else sees anonymous users as "Anonymous"
        
        if (isAnonymous && !isCurrentUserCreator && !isCurrentUser) {
            // Show as Anonymous to non-creators and non-self
            avatarInitials = "AN";
            displayName = "Anonymous";
        } else {
            // Show real name (creator viewing anyone, or user viewing themselves, or non-anonymous member)
            if (actualUsername) {
                avatarInitials = actualUsername.length >= 2 ? actualUsername.slice(0, 2).toUpperCase() : actualUsername.toUpperCase();
                displayName = actualUsername;
            } else if (actualFullName) {
                const nameParts = actualFullName.trim().split(' ');
                if (nameParts.length >= 2) {
                    avatarInitials = `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
                } else {
                    avatarInitials = actualFullName.slice(0, 2).toUpperCase();
                }
                displayName = actualFullName;
            } else {
                avatarInitials = `U${member.userId}`;
                displayName = `User${member.userId}`;
            }
        }
        
        return { avatarInitials, displayName };
    }

    useEffect(() => {
        const fetchData = async () => {
            if (groupCode) {
                const {data,status} = await fetchGroupDetailsByIdAPI(groupCode);
                if(status === 200){
                    setGroupData(data)
                }
            } else {
                setGroupData(null)
                console.warn("No group code found in URL.")
            }
        }
        fetchData()
    }, [groupCode])

    // Handler for leaving the group
    const handleLeaveGroup = async () => {
        if (!groupCode) return;
        
        const confirmLeave = window.confirm('Are you sure you want to leave this group? You will lose access to all resources and discussions.');
        if (!confirmLeave) return;

        setIsLeaving(true);
        try {
            const result = await leaveGroup(groupCode);
            if (result.success) {
                alert(`Successfully left the group!`);
                navigate('/join', { replace: true });
            } else {
                alert(`Failed to leave group: ${result.message}`);
            }
        } catch (error) {
            console.error('Leave group error:', error);
            alert('An error occurred while leaving the group. Please try again.');
        } finally {
            setIsLeaving(false);
        }
    };

    if (groupData === null) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <p>Loading group details or group not found...</p>
            </div>
        );
    }

    // If groupData is not null, we can safely access its properties without optional chaining for the top-level CardHeaders
    return (
        <div className='flex justify-center item-center'>
            <div className='container max-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-10  w-full overflow-x-hidden'>
                <div className='lg:col-span-2 flex flex-col gap-5 '>
                    <Card className='shadow-lg'>
                        <CardHeader >
                            {/* Now that groupData is guaranteed not null, we don't strictly need ?. here but it's harmless */}
                            <CardTitle className='font-bold text-2xl'>{groupData.name || 'Group Name'}</CardTitle>
                            <CardDescription>{groupData.description || 'Group Description'}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className='shadow-lg'>
                        <CardHeader>
                            <CardTitle className='font-bold text-2xl'>Syllabus</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {(() => {
                                if (groupData.syllabus?.topics && Array.isArray(groupData.syllabus.topics) && groupData.syllabus.topics.length > 0) {
                                    // Sort topics by created_at to maintain the original order from creation
                                    const sortedTopics = [...groupData.syllabus.topics].sort((a, b) => {
                                        const dateA = new Date(a.created_at || 0);
                                        const dateB = new Date(b.created_at || 0);
                                        return dateA.getTime() - dateB.getTime();
                                    });
                                    
                                    return (
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
                                                    {sortedTopics.map((topic) => (
                                                        <tr key={topic.id} className="border-b hover:bg-blue-50">
                                                            <td className="px-4 py-2 font-medium text-gray-900 align-top">{topic.title}</td>
                                                            <td className="px-4 py-2 text-gray-600 align-top">{topic.description || '-'}</td>
                                                            <td className="px-4 py-2 align-top">
                                                                {topic.subTopics && Array.isArray(topic.subTopics) && topic.subTopics.length > 0 ? (
                                                                    <ul className="list-disc ml-4">
                                                                        {(() => {
                                                                            // Sort subtopics by created_at to maintain the original order from creation
                                                                            const sortedSubTopics = [...topic.subTopics].sort((a, b) => {
                                                                                const dateA = new Date(a.created_at || 0);
                                                                                const dateB = new Date(b.created_at || 0);
                                                                                return dateA.getTime() - dateB.getTime();
                                                                            });
                                                                            
                                                                            return sortedSubTopics.map((subtopic) => (
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
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    );
                                } else {
                                    return <p>Syllabus not available. (Debug: syllabus={JSON.stringify(groupData.syllabus)})</p>;
                                }
                            })()}
                        </CardContent>
                    </Card>
                    <Card className='shadow-lg'>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className='font-bold text-2xl'>Members</CardTitle>
                            {/* Show Leave Group button for members (not creators) */}
                            {groupData.creatorId !== userId && (
                                <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={handleLeaveGroup}
                                    disabled={isLeaving}
                                    className="ml-auto"
                                >
                                    {isLeaving ? 'Leaving...' : 'Leave Group'}
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            {groupData.members && groupData.members.length > 0 ? (
                                <div className="flex flex-wrap gap-3">
                                    {groupData.members.map((member) => {
                                        const isCreator = member.userId === groupData.creatorId;
                                        const isCurrentUserCreator = Number(userId) === Number(groupData.creatorId);
                                        
                                        // Get display info based on visibility rules
                                        const { avatarInitials, displayName } = getMemberDisplayInfo(
                                            member, 
                                            Number(userId), 
                                            isCurrentUserCreator
                                        );
                                        
                                        return (
                                            <Tooltip key={member.id}>
                                                <TooltipTrigger asChild>
                                                    <div className="relative cursor-pointer">
                                                        <Avatar className="w-12 h-12">
                                                            <AvatarImage src="" />
                                                            <AvatarFallback className={`text-white font-semibold ${member.isAnonymous && !isCurrentUserCreator && member.userId !== Number(userId) ? 'bg-gray-500' : 'bg-blue-500'}`}>
                                                                {avatarInitials}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        {isCreator && (
                                                            <div className="absolute -top-1 -right-1">
                                                                <span className="bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                                                                    ★
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{displayName}{isCreator ? ' (Creator)' : ''}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p>No members found.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Forum Discussion Section */}
                    {groupCode && groupData && <Forum groupCode={groupCode} />}
                    
                </div>
                <div >
                    <ResourcesSection 
                        groupCode={groupCode || ''}
                        topics={groupData.syllabus?.topics || []}
                        canUpload={true}
                        initialResources={groupData.AdditionalResources || []}
                    />
                </div>
            </div>
        </div>
    )
}

export default StudyPlatform