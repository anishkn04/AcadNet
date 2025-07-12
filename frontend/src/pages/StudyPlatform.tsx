import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileArrowUp } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchGroupDetailsByIdAPI, getResourceStatusAPI } from '@/services/UserServices'
import type { Groups } from '@/models/User'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar'
import { LikeDislikeButton } from '@/components/own_components/LikeDislikeButton'

const StudyPlatform = () => {
    const [groupData, setGroupData] = useState<Groups | null>(null)
    const [resourceStatuses, setResourceStatuses] = useState<Record<number, any>>({})
    const [loadingStatuses, setLoadingStatuses] = useState(false)
    const location = useLocation()

    // Callback function to handle status updates from LikeDislikeButton
    const handleStatusUpdate = (resourceId: number, newStatus: { likesCount: number; dislikesCount: number; userReaction: 'like' | 'dislike' | null }) => {
        setResourceStatuses(prev => ({
            ...prev,
            [resourceId]: newStatus
        }));
        console.log(`Resource ${resourceId} status updated:`, newStatus); // Debug log
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const groupCode = params.get('code')
        const fetchData = async () => {
            if (groupCode) {
                const {data,status} = await fetchGroupDetailsByIdAPI(groupCode);
                if(status === 200){
                    console.log('groupdata',data)
                    setGroupData(data)
                    
                    // Fetch resource statuses for all resources
                    if (data.AdditionalResources && data.AdditionalResources.length > 0) {
                        setLoadingStatuses(true);
                        const statusPromises = data.AdditionalResources.map(async (resource) => {
                            if (resource.id) {
                                try {
                                    const { data: statusData, status: statusStatus } = await getResourceStatusAPI(resource.id);
                                    if (statusStatus === 200 && statusData.success) {
                                        // The API returns { resource: {...}, userReaction: ... }
                                        const resourceData = statusData.message.resource;
                                        const userReaction = statusData.message.userReaction;
                                        return { 
                                            id: resource.id, 
                                            status: {
                                                likesCount: resourceData.likesCount || 0,
                                                dislikesCount: resourceData.dislikesCount || 0,
                                                userReaction: userReaction
                                            }
                                        };
                                    }
                                } catch (error) {
                                    console.error(`Failed to fetch status for resource ${resource.id}:`, error);
                                }
                            }
                            return null;
                        });
                        
                        const statuses = await Promise.all(statusPromises);
                        const statusMap: Record<number, any> = {};
                        statuses.forEach(result => {
                            if (result) {
                                statusMap[result.id] = result.status;
                            }
                        });
                        console.log('Resource statuses fetched:', statusMap); // Debug log - remove in production
                        setResourceStatuses(statusMap);
                        setLoadingStatuses(false);
                    } else {
                        // If no additional resources, make sure loading is turned off
                        setLoadingStatuses(false);
                    }
                }
                
            } else {
                setGroupData(null)
                console.warn("No group code found in URL.")
            }
        }
        fetchData()
    }, [location.search])
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
                            {groupData.syllabus?.topics && groupData.syllabus.topics.length > 0 ? (
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
                                            {groupData.syllabus.topics.map((topic) => (
                                                <tr key={topic.id} className="border-b hover:bg-blue-50">
                                                    <td className="px-4 py-2 font-medium text-gray-900 align-top">{topic.title}</td>
                                                    <td className="px-4 py-2 text-gray-600 align-top">{topic.description || '-'}</td>
                                                    <td className="px-4 py-2 align-top">
                                                        {topic.subTopics && topic.subTopics.length > 0 ? (
                                                            <ul className="list-disc ml-4">
                                                                {topic.subTopics.map((subtopic) => (
                                                                    <li key={subtopic.id} className="mb-1">
                                                                        <span className="font-semibold text-blue-700">{subtopic.title}</span>
                                                                        {subtopic.content && (
                                                                            <span className="text-gray-500 ml-1">({subtopic.content})</span>
                                                                        )}
                                                                    </li>
                                                                ))}
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
                            ) : (
                                <p>Syllabus not available.</p>
                            )}
                        </CardContent>
                    </Card>
                    <Card className='shadow-lg'>
                        <CardHeader>
                            <CardTitle className='font-bold text-2xl'>Members</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {groupData.members && groupData.members.length > 0 ? (
                                <div className="flex flex-wrap gap-3">
                                    {groupData.members.map((member) => {
                                        // Get member info from UserModel if available
                                        const memberInfo = member.UserModel;
                                        const isCreator = member.userId === groupData.creatorId;
                                        
                                        // Generate avatar initials intelligently
                                        let avatarInitials = '';
                                        if (memberInfo?.fullName) {
                                            // If full name exists, use first letter of first two words
                                            const nameParts = memberInfo.fullName.trim().split(' ');
                                            avatarInitials = nameParts.length >= 2 
                                                ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
                                                : nameParts[0].slice(0, 2).toUpperCase();
                                        } else if (memberInfo?.username) {
                                            // If only username, avoid "User" pattern by using first and last chars or first 2
                                            const username = memberInfo.username;
                                            if (username.toLowerCase().startsWith('user')) {
                                                // For usernames like "user1", "user123", use 'U' + number
                                                const numberPart = username.replace(/^user/i, '');
                                                avatarInitials = numberPart ? `U${numberPart.slice(0, 1)}` : 'UN';
                                            } else {
                                                // For normal usernames, use first two characters
                                                avatarInitials = username.slice(0, 2).toUpperCase();
                                            }
                                        } else {
                                            // Fallback
                                            avatarInitials = `U${member.userId}`.slice(0, 2);
                                        }
                                        
                                        return (
                                            <div key={member.id} className="relative">
                                                <Avatar className="w-12 h-12">
                                                    <AvatarImage src="" />
                                                    <AvatarFallback className="bg-blue-500 text-white font-semibold">
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
                                        );
                                    })}
                                </div>
                            ) : (
                                <p>No members found.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div >
                    <Card className='shadow-lg'>
                        <CardHeader>
                            <CardTitle className=' flex justify-between items-center'><span className='font-bold text-2xl'>Resources</span>
                                <span className='text-blue-500 underline'>
                                    <FontAwesomeIcon icon={faFileArrowUp} />
                                    Upload
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {groupData.AdditionalResources && groupData.AdditionalResources.length > 0 ? (
                                <ul>
                                    {groupData.AdditionalResources.map((resource, index) => {
                                        const fileType = resource.fileType?.toLowerCase() || 'other';
                                        const fileName = resource.filePath.split('/').pop() || resource.filePath;
                                        let liBgClass = 'bg-gray-200';
                                        let badgeClass = 'bg-gray-200 text-gray-800';

                                        if (fileType === 'image') {
                                            liBgClass = 'bg-blue-400/10';
                                            badgeClass = 'bg-blue-200 text-blue-800';
                                        } else if (fileType === 'pdf') {
                                            liBgClass = 'bg-red-400/10';
                                            badgeClass = 'bg-red-200 text-red-800';
                                        } else if (fileType === 'doc') {
                                            liBgClass = 'bg-blue-400/10';
                                            badgeClass = 'bg-blue-200 text-blue-800';
                                        } else if (fileType === 'excel') {
                                            liBgClass = 'bg-yellow-400/10';
                                            badgeClass = 'bg-yellow-200 text-yellow-800';
                                        } else if (fileType === 'ppt') {
                                            liBgClass = 'bg-orange-400/10';
                                            badgeClass = 'bg-orange-200 text-orange-800';
                                        } else if (fileType === 'video') {
                                            liBgClass = 'bg-purple-400/10';
                                            badgeClass = 'bg-purple-200 text-purple-800';
                                        } else if (fileType === 'audio') {
                                            liBgClass = 'bg-pink-400/10';
                                            badgeClass = 'bg-pink-200 text-pink-800';
                                        } else if (fileType === 'text') {
                                            liBgClass = 'bg-green-400/10';
                                            badgeClass = 'bg-green-200 text-green-800';
                                        }

                                        return (
                                            <li key={index} className={`mt-1 flex flex-col items-center ${liBgClass} p-2 rounded-lg gap-2`}>
                                                <div className='flex items-center gap-2'>
                                                    <span className={`px-2 py-1 rounded ${badgeClass} font-mono text-xs`}>
                                                        {fileType.toUpperCase() || 'FILE'}
                                                    </span>
                                                    <a
                                                        href={'../../../'+resource.filePath}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline flex-1"
                                                    >
                                                        {fileName}
                                                    </a>
                                                    {resource.linkedTo && resource.linkedTo.topicId && (
                                                        <span className="text-sm text-gray-500 ml-2">
                                                            (Linked to Topic ID: {resource.linkedTo.topicId})
                                                        </span>
                                                    )}
                                                    {/* Show additional status info if available */}
                                                    {resource.id && (
                                                        loadingStatuses ? (
                                                            <div className="text-xs text-gray-400 ml-2">
                                                                Loading...
                                                            </div>
                                                        ) : resourceStatuses[resource.id] && (
                                                            <div className="text-xs text-gray-600 ml-2 flex items-center gap-1 transition-all duration-300 ease-in-out">
                                                                {resourceStatuses[resource.id].likesCount > 0 && (
                                                                    <span className="flex items-center gap-1">
                                                                        👍 {resourceStatuses[resource.id].likesCount}
                                                                    </span>
                                                                )}
                                                                {resourceStatuses[resource.id].dislikesCount > 0 && (
                                                                    <span className="flex items-center gap-1">
                                                                        👎 {resourceStatuses[resource.id].dislikesCount}
                                                                    </span>
                                                                )}
                                                                {resourceStatuses[resource.id].likesCount === 0 && resourceStatuses[resource.id].dislikesCount === 0 && (
                                                                    <span className="text-gray-400 italic">No reactions yet</span>
                                                                )}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                                {resource.id && (
                                                    <LikeDislikeButton
                                                        resourceId={resource.id}
                                                        initialLikesCount={resourceStatuses[resource.id]?.likesCount ?? (resource.likesCount || 0)}
                                                        initialDislikesCount={resourceStatuses[resource.id]?.dislikesCount ?? (resource.dislikesCount || 0)}
                                                        initialUserReaction={resourceStatuses[resource.id]?.userReaction ?? (resource.userReaction || null)}
                                                        onStatusUpdate={handleStatusUpdate}
                                                    />
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p>No resources available.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default StudyPlatform