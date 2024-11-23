import React, { useEffect, useState } from 'react'
import Loading from './Loading'
import {Navbar} from './Navbar'
import {Footer} from './Footer'
import Abi from '../assets/abi.png'
import { Navigate } from 'react-router-dom'
const RootPage = () => {
  const [color,setColor]=useState(false);
  const [Scroll,setScroll]=useState(false);
  setInterval(()=>{
    return setColor(!color);
  },2000);
  useEffect(()=>{
    setTimeout(()=>setScroll(true),5000);
    const scrollTimeout = setTimeout(() => {
      const bottomElement = document.getElementById("bottom");
      if (bottomElement) {
        bottomElement.scrollIntoView({ behavior: "smooth" });
      }
    },5000);
  },[])
  return (
    <>
    <div>
     <Navbar/>
     <div className='bg-violet-600 w-screen h-[600px]'>
         <div className='text-5xl text-white font-bold p-10'>
         <p className='hover:text-orange-400'>{color?(<span className='text-orange-500'>A</span>):(<span className='text-green-500'>A</span>)}LUMNIS-HUB</p>
          </div>
         <div className='w-[400px] h-[350px] border border-slate-50 rounded-lg bg-slate-200/20 backdrop-blur-3xl'>
             <div className='text-3xl text-white font-bold text-center'>OUR MOTO</div>
             <div className='text-lg text-white w-[90%] justify-center items-center flex'>Empowering connections, bridging experience with curiosity.
A hub for shared aspirations and achievements.
Where knowledge flows from mentors to eager learners.
Celebrating the journeys of our alumni and juniors alike.
Together, we build a stronger, united future.</div>
         <div className='w-full flex justify-end space-x-2'>
          <img src={Abi} alt="" className='w-[60px] h-[60px] rounded-full' /><div className='p-2 justify-center items-center flex flex-col'><p>ABISHEK</p><p className=' font-bold'>Founder & CEO</p><p>Mission Possible pvt lmt</p></div>
         </div>
         </div>
     </div>
     <div id='bottom'>
           <div className='w-[400px] h-[300px] border border-black rounded-lg'>
                <div className='text-2xl font-bold  text-center'>
                  Register Now!
                </div>
                <div>
                  <input type="text" />
                  <input type="text" name="" id="" />
                </div>
           </div>  
     </div>
    </div>
    </>
  )
}

export default RootPage