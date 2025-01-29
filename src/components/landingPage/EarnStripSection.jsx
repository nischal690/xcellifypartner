import React from 'react';
import { useNavigate } from 'react-router-dom';

import image1 from '../../assets/landingPageAssets/Images/image1.png';
import image2 from '../../assets/landingPageAssets/Images/image2.png';
import image3 from '../../assets/landingPageAssets/Images/image3.png';

const EarnStripSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-purple-primary py-3 sm:py-4 md:py-6">
      <div className="max-w-screen-lg mx-auto flex justify-center items-center gap-20 sm:gap-30 md:gap-40 lg:gap-80 px-4">
        <button onClick={() => navigate('/login')}>
          <img
            src={image1}
            alt="Register"
            className="cursor-pointer w-10 sm:w-14 md:w-16 lg:w-auto"
          />
        </button>
        <img
          src={image2}
          alt="Verify"
          className="w-8 sm:w-12 md:w-14 lg:w-auto"
        />
        <img
          src={image3}
          alt="Earn"
          className="w-8 sm:w-12 md:w-14 lg:w-auto"
        />
      </div>
    </section>
  );
};

export default EarnStripSection;
