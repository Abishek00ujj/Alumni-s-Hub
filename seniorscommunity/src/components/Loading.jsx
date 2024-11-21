import React from 'react'

const Loading = () => {
  return (
    <div className='w-screen h-screen bg-black justify-center items-center flex'>
          <div className='w-[100px] h-[100px] bg-orange-400 rounded-full'>
              <div className='w-[100px] h-[100px] bg-black rounded-full animate-bounce'></div>
          </div>
      </div>
  )
}

export default Loading