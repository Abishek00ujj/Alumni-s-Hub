import React from 'react'
import Loading from './Loading'
import {Navbar} from './Navbar'
import {Footer} from './Footer'
const RootPage = () => {
  return (
    <>
    <div>
     <Navbar/>
     <div className='bg-violet-600 w-screen h-[500px]'>
         <div className='text-3xl text-white font-bold p-10'>ALUMNIS-HUB</div>
         <div></div>
     </div>
    </div>
    </>
  )
}

export default RootPage