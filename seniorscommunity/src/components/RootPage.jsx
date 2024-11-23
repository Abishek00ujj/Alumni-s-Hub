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
     <Navbar/>
     <div className='w-screen h-screen justify-center items-center flex  min-2xl:flex max-lg:flex-col max-2xl:justify-between'>
     <div className=' bg-violet-600 w-full min-h-screen flex flex-col space-y-5 justify-center items-center'>
     <div className='text-5xl text-white font-bold '>
         <p className='hover:text-orange-400'>{color?(<span className='text-orange-500'>A</span>):(<span className='text-green-500'>A</span>)}LUMNIS-HUB</p>
          </div>
  <div className='w-[400px] h-[350px] border border-slate-50 rounded-lg bg-slate-200/20 backdrop-blur-3xl flex flex-col justify-center items-center text-center'>
    <div className='text-3xl text-white font-bold'>OUR MOTO</div>
    <div className='text-lg text-white w-[90%]'>
      Empowering connections, bridging experience with curiosity. A hub for shared aspirations and achievements. Where knowledge flows from mentors to eager learners. Celebrating the journeys of our alumni and juniors alike. Together, we build a stronger, united future.
    </div>
    <div className='w-full flex justify-end items-center space-x-2'>
      <img src={Abi} alt="" className='w-[60px] h-[60px] rounded-full' />
      <div className='p-2 flex flex-col'>
        <p className='text-white'>ABISHEK</p>
        <p className='font-bold text-white'>Founder & CEO</p>
        <p className='text-white'>Mission Possible pvt lmt</p>
      </div>
    </div>
  </div>
</div>
     <div id='bottom' className='w-full flex justify-center items-center'>
           <div className='w-[400px] h-[300px] border border-black rounded-lg  flex flex-col items-center justify-center space-y-5 mt-14 '>
                <div className='text-2xl font-bold  text-center'>
                  Join Now!
                </div>
                <div className=''>
                  <input type="text"  className='w-full h-10 border border-black pl-8 pr-8 pt-3 pb-3' placeholder='Official Email Address'/>
                  <div className=''>eg.abisheks22it@srishakthi.ac.in</div>
                </div>
                <div><button className='bg-orange-400 text-white p-3 rounded-lg'>Join the community!</button></div>
           </div>  
     </div>
    </div>
    </>
  )
}

export default RootPage