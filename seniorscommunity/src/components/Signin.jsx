import React, { useState } from 'react'
import Navbar from './Navbar'
import Stdimg from '../assets/clgstd.png'
import { LoaderIcon } from 'lucide-react'
export const Signin = () => {
   const [Loading,setLoading]=useState(true);
   const [darkmode,setDarkmode]=useState(true);
   const [Hide,setHide]=useState(true);
   const [Mail,setMail]=useState(false);
   const handleMail=()=>{
      if(Mail)
      {
         setMail(false);
      }
      else
      {
         setMail(true);
      }
   }
   const HandleMonkey = () => {
      setLoading(true);
      const timeoutId = setTimeout(() => {
         setLoading(false);
         setHide(false);
      }, 1000);
   
      return () => clearTimeout(timeoutId); 
   }
   
   const HandleDarkmode=()=>{
      if(darkmode)
      {
         setDarkmode(false);
      }
      else{
         setDarkmode(true);
      }
   }
  return (
    <>
      <Navbar />
      <div className={darkmode? ("w-screen h-screen bg-black  justify-center items-center flex flex-row-reverse min-2xl:flex max-lg:flex-col p-5 max-2xl:justify-between"):("w-screen h-screen bg-[#f8f8f8]  justify-center items-center flex flex-row-reverse min-2xl:flex max-lg:flex-col p-5 max-2xl:justify-between p-5")}>
         <div className='w-[400px] h-[380px] bg-slate-50 rounded-xl flex flex-col space-y-5 justify-center items-center border border-black m-10'>
            {
               Hide?(
                  <>
                  <div className='text-4xl font-bold' onClick={HandleDarkmode}>Sign in</div>
             <div> <span className='font-bold'>Students & Alumni</span> (SIET)</div>
             <div>Please select your year of passing to sign in.</div>
             <select name="" id="" className='p-3 w-[80%]' required>
                <option value="">Please select your year of passing</option>
                <option value="">2025</option>
                <option value="">2026</option>
                <option value="">2027</option>
                <option value="">2028</option>
             </select>
             <div>
                <button className='bg-blue-950 text-white p-3 rounded-xl' onClick={HandleMonkey}>Continue</button>
             </div>
            <div className='text-orange-400'>
            <span className='font-bold text-black'>New to ALUMNIS-HUB?</span> <span className='underline'>Register</span>
            
            </div>
            </>
               ):(
                  <div className='w-[400px] h-[380px] flex flex-col m-10 items-center justify-center gap-5'>
                     {
                        Loading ?(
                           <LoaderIcon className='animate-spin' color='orange'/> 
                        ):(
                           <>
                           <div className='text-2xl font-bold font-sans'>
                        Enter the registered email
                     </div>
                     <div>
                        <input type="text" className='border border-black pl-8 pr-8 pt-3 pb-3 rounded-lg w-full'placeholder='Email' />
                     </div>
                     <div>
                        <input type="password" name="" id="" className='border border-black pl-8 pr-8 pt-3 pb-3 rounded-lg w-full' placeholder='Password'/>
                     </div>
                     <div>
                        <button className='bg-orange-400 p-3 rounded-lg'>SIGN IN</button>
                     </div>
                           </>
                        )
                     }
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