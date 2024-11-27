import React from 'react'
import Navbar from './Navbar'
import  Construction  from "../assets/construction.png"
const Main = (props) => {
  return (
    <>
    <Navbar login={props.login}/>
    <div className='w-screen h-screen flex justify-center items-center'>
        <img src={Construction} alt="" className='w-[400px] h-[400px]'/>
    </div>
    </>
  )
}

export default Main