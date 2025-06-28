
import {motion} from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHourglassHalf } from '@fortawesome/free-solid-svg-icons'
function LoadingPage() {
  return (
    <div className='w-full h-svh flex justify-center items-center '>
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
		  animate={{ opacity: 1, y: 0 }}
		  transition={{ duration: 1 }}
          className='flex flex-col justify-center gap-2'>
            <FontAwesomeIcon icon={faHourglassHalf} className='animate-spin text-4xl' />
            <h1 className='text-3xl font-bold text-center'>Sending OTP</h1>
            <p className='font-medium text-md '>Please hold on while we set things up for you...</p>
        </motion.div>
    </div>
  )
}

export default LoadingPage