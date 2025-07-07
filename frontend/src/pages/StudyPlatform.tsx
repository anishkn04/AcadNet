import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileArrowUp } from '@fortawesome/free-solid-svg-icons'
import { useData } from '@/hooks/userInfoContext'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import type { Groups } from '@/models/User'

const StudyPlatform = () => {
    const { retreiveGroups } = useData()
    const [groupData, setGroupData] = useState<Groups | null>(null)
    const location = useLocation()

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const groupId = params.get('id')
        const fetchData = async () => {
            const response = await retreiveGroups()
            if (Array.isArray(response) && groupId) {
                const foundGroup = response.find((g) => String(g.id) === String(groupId))
                setGroupData(foundGroup || null)
            } else {
                setGroupData(null)
            }
        }
        fetchData()
    }, [location.search, retreiveGroups])

    return (
        <div className='flex justify-center item-center'>
            <div className='container max-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-10  w-full overflow-x-hidden'>
                <div className='lg:col-span-2 flex flex-col gap-5 '>
                    <Card className='shadow-lg'>
                        <CardHeader >
                            <CardTitle className='font-bold text-2xl'>{groupData?.name || 'Group Name'}</CardTitle>
                            <CardDescription>{groupData?.description || 'Group Description'}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className='shadow-lg'>
                        <CardHeader>
                            <CardTitle className='font-bold text-2xl'>Syllabus</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className='shadow-lg'>
                        <CardHeader>
                            <CardTitle className='font-bold text-2xl'>Members</CardTitle>
                        </CardHeader>
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
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default StudyPlatform