import React from 'react';

export default function WhyXcellify({ arrowImage, peopleImage, text }) {
  return (
    <div className="flex flex-col items-center text-center pt-12 px-4">
            <div className="bg-purple-500 text-white text-lg p-6 rounded-lg mt-4 max-w-2xl ms-96 my-20">
                Xcellify is built on the belief that growth and learning are limitless. With our robust platform, we amplify students’ ability to excel in academics, careers, and beyond.Let’s amplify excellence—because your potential deserves to shine!
            </div>
      

      {/* People Image */}
      <div className="w-full flex justify-center mt-6">
        <img src={peopleImage} alt="People" className="w-full object-contain" />
      </div>
    </div>
  );
}
