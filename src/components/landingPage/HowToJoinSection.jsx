import React from 'react';
import howToJoinImage from '../../assets/landingPageAssets/Images/howToJoinImage.png';

const HowToJoinSection = () => {
  return (
    <section id="how-to-start" className="bg-white py-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold font-dmsans text-blue-primary mb-12">
          How to Join?
        </h2>

        <div className="w-full flex justify-center">
          <img
            src={howToJoinImage}
            alt="How to Join"
            className="w-full sm:max-w-3xl lg:max-w-5xl xl:max-w-6xl h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default HowToJoinSection;
