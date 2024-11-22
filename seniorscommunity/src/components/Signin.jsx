import React from 'react'
import Navbar from './Navbar'
import Stdimg from '../assets/clgstd.png'
export const Signin = () => {
  return (
    <>
      <Navbar/>
      <div className='w-screen h-screen bg-black  justify-center items-center flex flex-row-reverse min-2xl:flex max-lg:flex-col p-5 max-2xl:justify-between p-5'>
         <div className='w-[450px] h-[400px] bg-slate-50 rounded-xl flex flex-col space-y-5 justify-center items-center'>
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
                <button className='bg-blue-950 text-white p-3 rounded-xl'>Sign in</button>
             </div>
            <div className='text-orange-400'>
            <span className='font-bold text-black'>New to ALUMNIS-HUB?</span> <span className='underline'>Register</span>
            </div>
         </div>
         <div className=' max-xl:w-[50%] max-sm:w-screen h-auto'>
              <img src={Stdimg} alt="" className='w-[500px] h-[400px]'/>
         </div>
      </div>
    </>
  )
}

export default Signin