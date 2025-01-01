import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useRef } from 'react'
import axios from 'axios';
import { Loader2Icon } from 'lucide-react';
import StudCard from '../components/StudCard';
const Home = () => {
  const [users,setUsers]=useState([]);
  const [loading,setLoading]=useState(false);
  const serachRef=useRef(null);
  const yearRef=useRef(null);
  const departRef=useRef(null);
  useEffect(()=>{
    const getData=async()=>{
      setLoading(true);
      try{
      const response=await axios.get('http://localhost:5000/api/v1/GetUser');
      if(response.data)
      {
        setUsers(response.data.data);
        // console.log(users.data);
      }
    }
    catch(err)
    {
       console.log(err);
    }
    finally{
      setLoading(false);
    }
    }
    getData();
  },[]);
  return (
    <>
    <Navbar/>
    {
      loading?(
         <>
           <div className='w-screen h-screen justify-center items-center flex bg-[#121212]'>
             <div className='w-[50px] h-[50px] bg-orange-400 rounded-full animate-spin'>
              <div className='w-[40px] h-[40px] bg-[#121212] rounded-full'></div>
              </div>
           </div>
         </>
      ):(
       <>
       <div className='w-screen h-screen bg-[#121212]'>
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
        <div className='w-full h-full space-y-3 items-center flex flex-col'>
          {
            users&& (
              users.map((item, index) => (
                <StudCard key={item.Email} props={item} />
              ))
            )
          }
        </div>
    </div>
       </>
      )
    }
    </>
  )
}

export default Home