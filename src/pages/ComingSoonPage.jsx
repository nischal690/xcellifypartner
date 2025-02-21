import React from 'react';

import Logo from '../assets/logo-primary.png';

import BoxCardImg from '../assets/ComingSoonAssets/Images/BoxCardImg.png';
import CircleImg from '../assets/ComingSoonAssets/Images/CircleImg.png';

import FacebookIcon from '../assets/ComingSoonAssets/Images/devicon-facebook.png';
import TwitterIcon from '../assets/ComingSoonAssets/Images/deviocn-x.png';
import InstagramIcon from '../assets/ComingSoonAssets/Images/devicon-instagram.png';
import LinkedInIcon from '../assets/ComingSoonAssets/Images/devicon-linkedin.png';
import YoutubeIcon from '../assets/ComingSoonAssets/Images/devicon-youtube.png';

const ComingSoonPage = () => {
  return (
    <div className="w-full h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-purple-primary bg-opacity-20"></div>

      <header className="fixed top-0 left-0 w-full z-50 flex justify-start py-4 px-6">
        <img
          src={Logo}
          alt="Xcellify Logo"
          className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 object-contain cursor-pointer"
        />
      </header>

      <div className="hidden lg:flex fixed mt-28">
        <img
          src={BoxCardImg}
          alt="box card"
          className="w-32 sm:w-36 md:w-30 lg:w-30 xl:w-40 h-auto object-contain"
        />
      </div>

      <div className="hidden lg:flex fixed bottom-0 right-0 m-0">
        <img
          src={CircleImg}
          alt="circle card"
          className="w-32 sm:w-36 md:w-40 lg:w-48 xl:w-60 h-auto object-contain"
        />
      </div>

      <div className="flex flex-col items-center justify-center h-full text-center px-6 sm:px-12">
        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-blue-primary">
          Exciting things are on the way! Our mobile experience is coming soon.
          Please visit us on a desktop for the full experience.
        </p>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-purple-primary pt-3 sm:pt-4 md:pt-5 leading-snug">
          <span>Coming</span>
          <span className="text-purple-primary"> Soon...</span>
        </h1>

        {/* Social Media Icons */}
        <div className="flex space-x-5 sm:space-x-10 mt-6 sm:mt-10">
          <a
            href="https://www.facebook.com/share/17tv5Rta4h/?mibextid=LQQJ4d"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={FacebookIcon}
              alt="Facebook"
              className="h-6 w-6 sm:h-8 sm:w-8"
            />
          </a>
          <a
            href="https://www.instagram.com/xcellify_official/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={InstagramIcon}
              alt="Instagram"
              className="h-6 w-6 sm:h-8 sm:w-8"
            />
          </a>
          <a
            href="https://www.x.com/xcellify"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={TwitterIcon} alt="X" className="h-6 w-6 sm:h-8 sm:w-8" />
          </a>
          <a
            href="https://www.linkedin.com/company/xcellify"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={LinkedInIcon}
              alt="LinkedIn"
              className="h-6 w-6 sm:h-8 sm:w-8"
            />
          </a>
          <a
            href="https://www.youtube.com/@Xcellify_official"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={YoutubeIcon}
              alt="YouTube"
              className="h-6 w-6 sm:h-8 sm:w-8"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
