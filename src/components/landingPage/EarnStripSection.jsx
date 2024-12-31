import React from 'react';

import image1 from '../../assets/landingPageAssets/Images/image1.png';
import image2 from '../../assets/landingPageAssets/Images/image2.png';
import image3 from '../../assets/landingPageAssets/Images/image3.png';

const EarnStripSection = () => {
  return (
    <section className="bg-purple-primary py-2">
      <div className="max-w-screen-xl mx-auto flex justify-center items-center gap-16 px-4">
        <div className="flex justify-center items-center">
          <img
            src={image1}
            alt="Register"
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-28 md:h-20"
          />
        </div>

        <div className="flex justify-center items-center">
          <img
            src={image2}
            alt="Checkmark"
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
          />
        </div>

        <div className="flex justify-center items-center">
          <img
            src={image3}
            alt="Financial Support"
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
          />
        </div>
      </div>
    </section>
  );
};

export default EarnStripSection;
