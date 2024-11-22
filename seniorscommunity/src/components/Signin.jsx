import React, { useState } from 'react'
import Navbar from './Navbar'
import Stdimg from '../assets/clgstd.png'
import { LoaderIcon } from 'lucide-react'
export const Signin = () => {
   const [Loading,setLoading]=useState(false);
   const [Hide,setHide]=useState(true);
   const HandleMonkey=()=>{
      if(Hide)
      {
         setHide(false);
      }
      else{
         setHide(true);
      }
   }
  return (
    <>
      <Navbar/>
      <div className='w-screen h-screen bg-black  justify-center items-center flex flex-row-reverse min-2xl:flex max-lg:flex-col p-5 max-2xl:justify-between p-5'>
         <div className='w-[400px] h-[380px] bg-slate-50 rounded-xl flex flex-col space-y-5 justify-center items-center'>
            {
               Hide?(
                  <>
                  <div className='text-4xl font-bold'>Sign in</div>
             <div> <span className='font-bold'>Students & Alumni</span> (SIET)</div>
             <div>Please select your year of passing to sign in.</div>
             <select name="" id="" className='p-3 w-[80%]'>
                <option value="">Please select your year of passing</option>
                <option value="">2025</option>
                <option value="">2026</option>
                <option value="">2027</option>
                <option value="">2028</option>
             </select>
             <div>
                <button className='bg-blue-950 text-white p-3 rounded-xl' onClick={HandleMonkey}>Sign in</button>
             </div>
            <div className='text-orange-400'>
            <span className='font-bold text-black'>New to ALUMNIS-HUB?</span> <span className='underline'>Register</span>
            
            </div>
            </>
               ):(
                  <div>
                     <LoaderIcon className='animate-spin' color='orange'/>
                  </div>
               )
            }
         </div>
         <div className=' max-xl:w-[50%] max-sm:w-screen h-auto'>
              <img src={Stdimg} alt="" className='w-[500px] h-[400px]'/>
         </div>
      </div>
    </>
  )
}

export default Signin