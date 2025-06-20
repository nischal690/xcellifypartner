import React from 'react';

import { useNavigate } from 'react-router-dom';

import imgIcon1 from '../../assets/landingPageAssets/Icons/genuineimg1.png';
import imgIcon2 from '../../assets/landingPageAssets/Icons/Enhancedimg2.png';
import imgIcon3 from '../../assets/landingPageAssets/Icons/Marketingimg3.png';
import imgIcon4 from '../../assets/landingPageAssets/Icons/Seamlessimg4.png';
import imgIcon5 from '../../assets/landingPageAssets/Icons/ExpandReachimg5.png';

const whyxcellifyData = [
  {
    image: imgIcon1,
    title: 'Genuine, Targeted Audience',
    description:
      'Directly reach a dedicated student base actively seeking your offerings.',
  },
  {
    image: imgIcon2,
    title: 'Enhanced Visibility',
    description:
      'Showcase your offerings to thousands of students on a platform built to spotlight your brand.',
  },
  {
    image: imgIcon3,
    title: 'Marketing Support',
    description:
      'Leverage Xcellify’s website, newsletters, and social media channels to promote your business.',
  },
  {
    image: imgIcon4,
    title: 'Seamless Integration',
    description:
      'Effortlessly list and manage your services on our user-friendly platform.',
  },
  {
    image: imgIcon5,
    title: 'Expand Your Reach for Free',
    description:
      'Sign up as a partner for free and benefit from our rapidly growing marketplace.',
  },
];

const WhyXcellifySection = () => {
  const navigate = useNavigate();
  return (
    <section id="why-partner" className="bg-white py-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold font-dmsans text-blue-primary mb-12 text-center">
          Why Partner with Xcellify?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {whyxcellifyData.map((item, index) => (
            <div
              key={index}
              className="bg-purple-primary text-white rounded-lg p-4 flex flex-col shadow-md"
            >
              <div className="flex items-center space-x-1">
                <img src={item.image} alt={item.title} />
                <h3 className="text-base font-semibold font-dmsans leading-tight">
                  {item.title}
                </h3>
              </div>

              <p className="text-sm mt-2 text-left">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            className="
      mt-12 
      text-[#F3F1FF] 
      px-4 sm:px-6 md:px-8 
      py-2 sm:py-3 md:py-4 
      rounded-lg 
      font-bold 
      text-sm sm:text-base md:text-lg 
      font-dmsans 
      hover:bg-[#876FFD] 
      transition-all duration-300 
      bg-gradient-to-r from-[#876FFD] to-[#19074A]
    "
            onClick={() => navigate('/signup')}
          >
            Sign Up Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhyXcellifySection;
