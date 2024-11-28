import React from 'react'
import Navbar from './Navbar'
import  Construction  from "../assets/construction.png"
const Main = (props) => {
  const data1=sessionStorage.getItem('data');
  console.log(data1);
  return (
    <>
    <Navbar login={props.login}/>
    
    </>
  )
}

export default Main