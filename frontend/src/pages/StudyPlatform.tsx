import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchGroupDetailsByIdAPI } from '@/services/UserServices'
import type { Groups } from '@/models/User'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar'
import Forum from '@/components/own_components/Forum'
import ResourcesSection from '@/components/own_components/ResourcesSection'

const StudyPlatform = () => {
    const [groupData, setGroupData] = useState<Groups | null>(null)
    const location = useLocation()

    // Get groupCode from URL
    const params = new URLSearchParams(location.search)
    const groupCode = params.get('code')

    useEffect(() => {
        const fetchData = async () => {
            if (groupCode) {
                const {data,status} = await fetchGroupDetailsByIdAPI(groupCode);
                if(status === 200){
                    console.log('groupdata',data)
                    setGroupData(data)
                }
            } else {
                setGroupData(null)
                console.warn("No group code found in URL.")
            }
        }
        fetchData()
    }, [groupCode])
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