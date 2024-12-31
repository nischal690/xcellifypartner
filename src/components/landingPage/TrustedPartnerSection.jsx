import React from 'react';

import { useNavigate } from 'react-router-dom';

import partnerImage1 from '../../assets/landingPageAssets/Images/partnerImage1.png';
import partnerImage2 from '../../assets/landingPageAssets/Images/partnerImage2.png';
import buttonIcon from '../../assets/landingPageAssets/Icons/buttonIcon.png';

const TrustedPartnerSection = () => {
  const navigate = useNavigate();
  return (
    <section id="trusted-partner" className="bg-white py-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 flex justify-center">
          <img
            src={partnerImage1}
            alt="Trusted Partner Illustration"
            className="w-full max-w-xs sm:max-w-sm lg:max-w-md h-auto"
          />
        </div>

        <div className="lg:w-1/2 text-center relative">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-primary font-dmsans leading-tight relative z-10">
            Become a Trusted
            <br />
            <span
              className="text-5xl sm:text-6xl text-purple-primary font-extrabold relative z-10"
              style={{
                display: 'inline-block',
                // backgroundImage: `url(${partnerImage2})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'contain',
                padding: '0 1rem',
              }}
            >
              Partner
            </span>
            <br />
            on Xcellify Today
          </h2>

          <p className="text-gray-600 text-lg mt-4 relative z-10">
            Don’t miss this opportunity to expand your business and connect with
            students across India.
          </p>

          <div className="relative mt-8 inline-block">
            <button
              style={{
                background: 'linear-gradient(to right, #876FFD, #6C59CA)',
              }}
              className="text-[#F3F1FF] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#957EE0] transition-all duration-300"
              onClick={() => navigate('/signup')}
            >
              Register now
            </button>
            <img
              src={buttonIcon}
              alt="Button Icon"
              className="absolute -bottom-4 -right-6 w-6 h-6 transform rotate-12"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedPartnerSection;
