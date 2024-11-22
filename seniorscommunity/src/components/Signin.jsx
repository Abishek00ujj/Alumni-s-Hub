import React, { useState } from 'react'
import Navbar from './Navbar'
import Stdimg from '../assets/clgstd.png'
export const Signin = () => {
   const [Loading,setLoading]=useState(false);
   const [darkmode,setDarkmode]=useState(true);
   const [Hide,setHide]=useState(true);
   const [Mail,setMail]=useState(false);
   const HandleMonkey = () => {
      setHide(false);
      setLoading(true);
      setTimeout(()=>setLoading(false),1000);
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
             <select name="" id="" className='p-3 w-[80%] border border-black rounded-lg' required>
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
                  <div className='w-full h-full flex flex-col justify-around items-center space-y-5'>
                     {
                        Loading ?(
                           <div className='w-full h-full justify-center items-center flex'>
                           <div className='w-[50px] h-[50px] bg-orange-400 rounded-full animate-spin'>
                               <div className='w-[40px] h-[40px] bg-[#f8f8f8] rounded-full'></div>
                           </div>
                       </div>
                        ):(
                           <>
                           <div className='text-2xl font-bold font-sans'>
                        Enter the registered email!
                     </div>
                     <div>
                        <input type="text" className='border border-black pl-8 pr-8 pt-3 pb-3 rounded-lg w-full'placeholder='Email' />
                     </div>
                     <div>
                        <input type="password" name="" id="" className='border border-black pl-8 pr-8 pt-3 pb-3 rounded-lg w-full' placeholder='Password'/>
                     </div>
                     <div>
                        <button className='bg-blue-950 p-3 rounded-lg text-white'>SIGN IN</button>
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

export default Signin;