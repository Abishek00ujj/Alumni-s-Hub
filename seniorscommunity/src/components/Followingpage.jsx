import React, { useEffect, useState } from 'react'
import FollowCard from './FollowCard'
export const Followingpage = (props) => {
    const [data,setData]=useState([]);
    console.log(data);
    useEffect(()=>setData(props.props),[])
  return (
    <div className='w-screen h-full flex justify-center items-center'>
    {
   data&&(
     data.map((item,index)=>(
        <FollowCard data={item}/>
    ))
    )
    }
    </div>
  )
}

export default Followingpage