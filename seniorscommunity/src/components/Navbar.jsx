import React from 'react'
import {School, User2} from 'lucide-react'
const Navbar = () => {
  return (
     <>
       <div className='w-screen bg-blue-300 h-12 flex justify-between'>
          <div className='flex'>
             <School className='w-10 h-10 pl-2 text-black bold'/>
               <p className='flex items-center p-2 text-2xl'>Seniors-hub</p>
          </div>
          <div className='flex'>
              <User2 className='flex items-center m-3 rounded-lg border-2 m-2 border-black'/>
          </div>
       </div>
     </>
  )
}

export default Navbar