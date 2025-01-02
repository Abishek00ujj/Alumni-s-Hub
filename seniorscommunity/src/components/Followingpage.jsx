import React, { useEffect, useState } from 'react'
import FollowCard from './FollowCard'
export const Followingpage = (props) => {
    const [data,setData]=useState([]);
    console.log(data);
    useEffect(()=>setData(props.props),[])
  return (
    <div className='max-2xl:w-screen w-[50%] h-full flex justify-center items-start'>
    {
   data&&(
     data.map((item,index)=>(
        <FollowCard data={item} key={index}/>
    ))
    )
    }
    </div>
  )
}

export default Followingpage