import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useRef } from 'react'
import axios from 'axios';
import { Loader2Icon } from 'lucide-react';
import StudCard from '../components/StudCard';
const Home = () => {
  const [users,setUsers]=useState([]);
  const [loading,setLoading]=useState(false);
  const [year,setyear]=useState('');
  const [batch,setbatch]=useState('');
  const [searchQuery,setsearchQuery]=useState('');
  const storedUserDetails = JSON.parse(localStorage.getItem("data"));
  // console.log(storedUserDetails.Email);
  useEffect(()=>{
    const getData=async()=>{
      setLoading(true);
      try{
      const response=await axios.get('https://alumni-s-hub.onrender.com/api/v1/GetUser');
      if(response.data)
      {
        setUsers(response.data.data);
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
  // console.log(users);
  const filterData=users.filter((item)=>(item.Name.toLowerCase().includes(searchQuery.toLowerCase())
  &&(item.Email!=storedUserDetails.Email) &&
    (batch==''||item.Department==batch) &&
    (year==''||item.Year==year)
  ))
//Department: "IT"
// ​​
// Email: "abisheks22it@srishakthi.ac.in"
// ​​
// Name: "ABISHEK S"
// ​​
// Year: "22"
// ( item.Department.toLowerCase().includes(batch.toLowerCase()) ||
// item.Year.toLowerCase().includes(year.toLowerCase()))
  // console.log(users);
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
           <input type="text" placeholder='Search by Name or Batch or Department' className='max-2xl:w-[50%] w-[500px] pt-2 pb-2 rounded-lg text-start p-2 font-bold'
           onChange={(e)=>setsearchQuery(e.target.value)}
           value={searchQuery}
           />
           <select className='text-center text-[22px] w-[80px] h-[45px] rounded-lg' name="BATCH" id=""
           value={year}
           onChange={(e)=>setyear(e.target.value)}>
           <option value="">Year</option>
            <option value="20">20</option>
            <option value="21">21</option>
            <option value="22">22</option>
            <option value="23">23</option>
            <option value="24">24</option>
           </select>
           <select className='text-center text-[20px] w-[80px] h-[45px] rounded-lg' name="" id=""
            value={batch}
            onChange={(e)=>setbatch(e.target.value)}>
           <option value="">Branch</option>
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
        <div className='w-full h-full space-y-3 justify-evenly max-2xl:items-center flex max-2xl:flex-col'>
          {
            filterData&& (
              filterData.map((item, index) => (
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