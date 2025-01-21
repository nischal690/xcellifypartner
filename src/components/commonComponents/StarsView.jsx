import React from 'react'
import { FaStar } from 'react-icons/fa'

export default function StarsView({
    rating,
}) {
  return (
    <div className='flex flex-row items-center ml-1 space-x-1'>
        {
            [...Array(5)].map((value, index)=>(
            <FaStar className={`${(index+1)<=rating ? 'text-yellow-400': 'text-gray-200'}`}/>
            ))
        }
    </div>
  )
}
