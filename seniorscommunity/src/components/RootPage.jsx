import React from 'react'

const RootPage = () => {
  return (
    <>
      <div className='w-screen h-screen'>
        <div className='w-[60%] border-2 border-black min-h-50 max-h-50 flex'>
           <div className='w-[100%] m-10'>
              <p>View your seniors</p>
           </div>
           <div className='w-[60%]  flex'>
                <div className='w-[100%] p-10 border-2 border-black'>
                   <p>Senior register</p>
                </div>
                <div className='w-[100%] p-10 border-2 border-black'>
                   <p>Junior register</p>
                </div>
           </div>
        </div>
      </div>
    </>
  )
}

export default RootPage