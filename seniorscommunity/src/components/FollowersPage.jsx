import React,{useState,useEffect} from 'react'
import FollowCard from './FollowCard'
export const FollowersPage = (props) => {
  const [data,setData]=useState([]);
      console.log(data);
      useEffect(()=>setData(props.props),[])
    return (
      <div className='max-2xl:w-screen w-[50%] h-full space-y-2 flex flex-col justify-start items-center'>
        <div>
          Follower
        </div>
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

export default FollowersPage