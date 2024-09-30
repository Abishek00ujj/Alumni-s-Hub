import React from 'react'
import {Heart} from 'lucide-react'
const Footer = () => {
  return (
    <div className='fixed bottom-0 w-screen bg-blue-300 h-12 flex'>
       <div className='flex justify-center w-screen'>
            <p>Made with</p><Heart className='w-4 ml-2 mr-2'/>
            <p>by Abishek</p>
       </div>
    </div>
  )
}

export default Footer