import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileArrowUp } from '@fortawesome/free-solid-svg-icons'
const StudyPlatform = () => {
  return ( 
    <div className='flex justify-center item-center'>
        <div className='container max-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-10  w-full overflow-x-hidden'>
            <div className='lg:col-span-2 flex flex-col gap-5 '>
                <Card className='shadow-lg'>
                    <CardHeader >
                        <CardTitle className='font-bold text-2xl'>Study Group</CardTitle>
                        <CardDescription>This group focuses on advanced calculus topics, including multivariable calculus, differential equations, and real analysis. We et weekly to discuss problems, share resources, and collaborate on projects.</CardDescription>
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