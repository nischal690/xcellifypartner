import React from 'react';
import Slider from 'react-slick';

import { useNavigate } from 'react-router-dom';

import sliderimg1 from '../../assets/landingPageAssets/Images/sliderimg1.png';
import sliderimg2 from '../../assets/landingPageAssets/Images/sliderimg2.png';
import sliderimg3 from '../../assets/landingPageAssets/Images/sliderimg3.png';
import sliderimg4 from '../../assets/landingPageAssets/Images/sliderimg4.png';
import sliderimg5 from '../../assets/landingPageAssets/Images/sliderimg5.png';
import sliderimg6 from '../../assets/landingPageAssets/Images/sliderimg6.png';
import sliderimg7 from '../../assets/landingPageAssets/Images/sliderimg7.png';
import sliderimg8 from '../../assets/landingPageAssets/Images/sliderimg8.png';
import sliderimg9 from '../../assets/landingPageAssets/Images/sliderimg9.png';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const WhatCanYouSellData = [
  {
    image: sliderimg1,
    title: 'Career Counselling',
    description:
      'Help students discover their true potential through expert guidance.',
  },
  {
    image: sliderimg2,
    title: 'Study Overseas',
    description:
      'Provide consultancy for admissions, visas, and scholarships abroad.',
  },
  {
    image: sliderimg3,
    title: 'Study in India',
    description: 'List schools, colleges, universities, and programs in India.',
  },
  {
    image: sliderimg4,
    title: 'Tutoring',
    description:
      'Offer online or offline tutoring services for different subjects and academic levels.',
  },
  {
    image: sliderimg5,
    title: 'Summer Courses',
    description:
      'Promote workshops, certifications, and specialised training programs in India & abroad.',
  },
  {
    image: sliderimg6,
    title: 'Financial Support',
    description:
      'Facilitate education loans, scholarships, and student insurance services.',
  },
  {
    image: sliderimg7,
    title: 'Merchandise',
    description:
      'Sell student-friendly products like stationery, gadgets, and lifestyle essentials.',
  },
  {
    image: sliderimg8,
    title: 'Activities',
    description:
      'Register students for diverse hobby classes, learning activities, and skill-building workshops.',
  },
];

const CustomArrow = ({ className, onClick, direction }) => (
  <button
    className={`${className}  w-12 h-12 flex items-center justify-center z-10 absolute top-1/2 transform -translate-y-1/2 ${
      direction === 'left' ? 'left-2 sm:left-4' : 'right-2 sm:right-4'
    }`}
    onClick={onClick}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-6 h-6 text-purple-primary"
    >
      {direction === 'left' ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19l-7-7 7-7"
        />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      )}
    </svg>
  </button>
);

const WhatCanYouSellSection = () => {
  const navigate = useNavigate();
  const settings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <CustomArrow direction="right" />,
    prevArrow: <CustomArrow direction="left" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          arrows: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          arrows: true,
        },
      },
    ],
  };

  return (
    <section id="what-to-sell" className="bg-white py-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold font-dmsans text-blue-primary mb-9">
          What Can You Sell?
        </h2>
        <p className="text-lg sm:text-xl lg:text-xl text-blue-primary font-dmsans mb-8 leading-relaxed">
          Xcellify invites all sellers offering services and products crafted to
          empower students <br /> and meet their diverse needs.
        </p>

        <Slider {...settings}>
          {WhatCanYouSellData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-lg mx-3 sm:mx-5 border border-gray-200"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-28 h-28 mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-blue-primary mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-gray-700">{item.description}</p>
            </div>
          ))}

          <div className="bg-purple-primary rounded-lg p-6 shadow-lg mx-3 sm:mx-5 border border-purple-300 flex flex-col justify-between items-center">
            <div className="flex flex-col items-center">
              <img
                src={sliderimg9}
                alt="More Categories"
                className=" object-contain mx-auto mb-6"
              />
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 text-center">
                More Categories <br /> Launching Soon!
              </h3>
            </div>
          </div>
        </Slider>

        <button
          style={{
            background: 'linear-gradient(to right, #876FFD, #19074A)',
          }}
          className="mt-12 text-[#F3F1FF] px-8 py-4 rounded-lg font-semibold text-lg font-dmsans hover:bg-[#876FFD] transition-all duration-300"
          onClick={() => navigate('/login')}
        >
          Earn with Xcellify Now
        </button>
      </div>
    </section>
  );
};

export default WhatCanYouSellSection;
