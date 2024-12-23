import {ChevronDown,ChevronUp,UserCircleIcon} from 'lucide-react'
import { useState } from 'react'
import {Link} from 'react-router-dom'

export const Navbar = () => {
  const [downbar,setDownbar]=useState(false);
  const handleDownbar=()=>{
    if(downbar)
    {
       setDownbar(false);
    }
    else
    {
      setDownbar(true);
    }
  }
  let UserData=localStorage.getItem('data');
  return (
     <>
        <div className='w-screen h-[8vh] bg-blue-950 flex space-x-4 justify-between p-2'>
          <div className='flex space-x-3'>
            <div className='text-white font-sans font-bold text-2xl flex justify-center items-center hover:text-orange-400'>ALUMNIS HUB |</div>
          </div>
            <div className='flex justify-center items-center text-white space-x-3'>
               {
                 downbar?(
                  <ChevronDown size={40} onClick={handleDownbar}/>
                 ):(
                  <ChevronUp size={40} onClick={handleDownbar}/>
                 )
               }
             {/* <Link to={'/signin'}> <button className='bg-orange-400 rounded-xl p-3 text-white font-bold flex hover:text-black'>SIGN IN</button></Link> */}
             {
                UserData&&(
                  <>
                     <Link to={'/Profile'}> <div className=' rounded-full p-3 text-white font-bold flex hover:text-orange'><UserCircleIcon size={40}/></div></Link>
                  </>
                )
             }
            </div>
        </div>
        {
          downbar?(
            <div className='w-[500px] h-auto flex flex-col bg-slate-600 absolute right-0'>
            <div className='h-10 border-2 border-white p-3 text-center justify-center items-center flex text-white bg-zinc-800'> Sign up</div>
            <div className='h-10 border-2 border-white p-3 text-center justify-center items-center flex  text-white bg-zinc-800'> Blogs</div>
            <div className='h-10 border-2 border-white p-3 text-center justify-center items-center flex  text-white bg-zinc-800'> Contact us</div>
            <div className='h-10 border-2 border-white p-3 text-center justify-center items-center flex  text-white bg-zinc-800'> About us</div>
            </div>
          ):(
               <>
               </>
          )
        }
      
     </>
  )
}

export default Navbar