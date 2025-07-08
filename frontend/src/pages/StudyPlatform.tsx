import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileArrowUp } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchGroupAPI, fetchGroupDetailsByIdAPI } from '@/services/UserServices'
import type { Groups } from '@/models/User'

const StudyPlatform = () => {
    const [groupData, setGroupData] = useState<Groups | null>(null)
    const location = useLocation()

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const groupCode = params.get('code')
        const fetchData = async () => {
            if (groupCode) {
                const { data, status } = await fetchGroupAPI();
                if (status === 200 && Array.isArray(data.message)) {
                    const group = data.message.find((g: {groupCode:string}) => g.groupCode === groupCode)
                    if (group && group.id) {
                        const { data: groupDetails, status: groupStatus } = await fetchGroupDetailsByIdAPI(group.id)
                        if (groupStatus === 200 && groupDetails.success) {
                            console.log("Fetched group details:", groupDetails.message) // Add this for debugging
                            setGroupData(groupDetails.message)
                        } else {
                            setGroupData(null)
                            console.error("Failed to fetch group details or success was false.")
                        }
                    } else {
                        setGroupData(null)
                        console.error("Group not found with the provided code or missing ID.")
                    }
                } else {
                    setGroupData(null)
                    console.error("Failed to fetch all groups or data.message is not an array.")
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
                            {groupData.Syllabus?.Topics && groupData.Syllabus.Topics.length > 0 ? (
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
                                            {groupData.Syllabus.Topics.map((topic) => (
                                                <tr key={topic.id} className="border-b hover:bg-blue-50">
                                                    <td className="px-4 py-2 font-medium text-gray-900 align-top">{topic.title}</td>
                                                    <td className="px-4 py-2 text-gray-600 align-top">{topic.description || '-'}</td>
                                                    <td className="px-4 py-2 align-top">
                                                        {topic.SubTopics && topic.SubTopics.length > 0 ? (
                                                            <ul className="list-disc ml-4">
                                                                {topic.SubTopics.map((subtopic) => (
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
                                <ul>
                                    {groupData.members.map((member) => (
                                        <li key={member.id} className="mt-1">
                                            Member ID: {member.userId} {member.isAnonymous ? '(Anonymous)' : ''}
                                            {groupData.creator?.username && member.userId === groupData.creator.user_id && ` (${groupData.creator.username} - Creator)`}
                                        </li>
                                    ))}
                                </ul>
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
                                            <li key={index} className={`mt-1 flex items-center ${liBgClass} p-2 rounded-lg gap-2`}>
                                                <span className={`px-2 py-1 rounded ${badgeClass} font-mono text-xs`}>
                                                    {fileType.toUpperCase() || 'FILE'}
                                                </span>
                                                <a
                                                    href={resource.filePath}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {fileName}
                                                </a>
                                                {resource.linkedTo && resource.linkedTo.topicId && (
                                                    <span className="text-sm text-gray-500 ml-2">
                                                        (Linked to Topic ID: {resource.linkedTo.topicId})
                                                    </span>
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