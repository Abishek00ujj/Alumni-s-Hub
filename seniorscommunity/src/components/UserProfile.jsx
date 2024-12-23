import React from 'react'
import Navbar from './Navbar'
const UserProfile = () => {
  return (
    <>
    <Navbar/>
    <div className='w-screen bg-black'>
    <div className='w-full h-full flex justify-center items-center flex-col space-y-5'>
    <img   src="https://leetcard.jacoblin.cool/abisheks123?theme=dark&font=Nunito&ext=heatmap" />  
<h2 align="center" className='text-2xl text-white'>⚡ Current Stats ⚡</h2>
  <img  src="https://streak-stats.demolab.com/?user=Abishek00ujj&count_private=true&theme=react&border_radius=10" alt="streak stats"/>
  <img src="https://github-readme-stats.vercel.app/api?username=Abishek00ujj&show_icons=true&theme=react&rank_icon=github&border_radius=10" alt="readme stats" />
  <img  align="center" src="https://github-readme-stats.vercel.app/api/top-langs/?username=Abishek00ujj&hide=HTML&langs_count=8&layout=compact&theme=react&border_radius=10&size_weight=0.5&count_weight=0.5&exclude_repo=github-readme-stats" alt="top langs" />
</div>
    </div>
    </>
  )
}

export default UserProfile