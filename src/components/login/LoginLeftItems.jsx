import React from 'react'

export default function LoginLeftItems({img, content}) {
  return (
    <div className='flex items-center w-full space-x-4'>
        <img src={img} alt="" className='xl:w-14 xl:h-14 lg:w-12 lg:h-12 md:w-10 md:h-10'/>
        <p className='ps-4 text-purple-primary md:text-lg lg:text-[22px] font-semibold'>{content}</p>
    </div>
  )
}
