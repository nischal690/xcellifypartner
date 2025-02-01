import React from 'react';

export default function MagicLetters({ image, content }) {
  return (
    <div className="flex items-start w-full space-x-14">
      {/* Image Section (Half Width) */}
      <div className="w-[400px] flex justify-center items-center ">
        <img src={image} alt="Magic" className="w-full h-auto object-cover border-t-4 border-purple-primary" />
      </div>

      {/* Text Section (Half Width) */}
      <div className="w-2/3 flex items-center">
        <ul className="list-disc text-xl text-gray-700">
          <li className='text-justify'>{content}</li>
        </ul>
      </div>
    </div>
  );
}
