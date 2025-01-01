import React from 'react'
import Navbar from '../components/Navbar'
import { useRef } from 'react'
const Home = () => {
  const serachRef=useRef(null);
  const yearRef=useRef(null);
  const departRef=useRef(null);
  return (
    <>
    <Navbar/>
    <div className='w-screen h-screen bg-black'>
        <div className='w-full flex justify-center items-center pt-4 space-x-2'>
           <input type="text" placeholder='Search by Name or Batch or Department' className='max-2xl:w-[50%] w-[500px] pt-2 pb-2 rounded-lg text-start p-2 font-bold'/>
           <select className='text-center text-[22px] w-[80px] h-[45px] rounded-lg' name="BATCH" id="">
            <option value="20">20</option>
            <option value="21">21</option>
            <option value="22">22</option>
            <option value="23">23</option>
            <option value="24">24</option>
           </select>
           <select className='text-center text-[22px] w-[80px] h-[45px] rounded-lg' name="" id="">
           <option  value="IT">IT</option>
            <option  value="DS">DS</option>
            <option value="ECE">ECE</option>
            <option value="CYS">CYS</option>
            <option value="ML">ML</option>
            <option value="CSE">CSE</option>
            <option value="AGRI">AGRI</option>
            <option value="BME">BME</option>
            <option value="BT">BT</option>
            <option value="CIVIL">CIVIL</option>
            <option value="EEE">EEE</option>
            <option value="FT">FT</option>
            <option value="MECH">MECH</option>
           </select>
        </div>
    </div>
    </>
  )
}

export default Home