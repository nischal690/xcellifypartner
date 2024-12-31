import React from 'react';

import { useNavigate } from 'react-router-dom';

import HeroSectionImage from '../../assets/landingPageAssets/Images/herosecsideimg.png';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center">
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <h1 className="text-4xl sm:text-5xl font-bold font-dmsans text-blue-primary leading-tight mb-6 text-left">
            Sell Where Thousands of Students Shop, Learn, and Grow
          </h1>
          <p className="text-lg sm:text-xl lg:text-xl text-blue-primary font-dmsans mb-8 leading-relaxed text-left">
            Join Xcellify’s vibrant student marketplace to showcase your
            products and services to an engaged, targeted audience. Tailored for
            the unique needs of students, Xcellify connects partners like you
            with a community actively searching for what you offer.
          </p>

          <button
            style={{
              background: 'linear-gradient(to right, #876FFD, #6C59CA)',
            }}
            className="
              text-[#F3F1FF] 
              w-full sm:w-9/12 
              px-6 py-3 sm:px-8 sm:py-4 
              rounded-lg 
              font-semibold 
              text-sm sm:text-base md:text-lg 
              font-dmsans 
              hover:bg-[#957EE0] 
              transition-all duration-300 
              whitespace-nowrap
            "
            onClick={() => navigate('/signup')}
          >
            Partner with Xcellify Today
          </button>
        </div>

        <div className="lg:w-1/2 flex justify-center">
          <img
            src={HeroSectionImage}
            alt="Hero Section Illustration"
            className="w-full max-w-xs h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
