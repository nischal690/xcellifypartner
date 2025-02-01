import React from 'react';
import footerLogo from '../../assets/landingPageAssets/Images/logo.png';
import {
  FaFacebook,
  FaInstagram,
  FaSnapchat,
  FaDiscord,
  FaYoutube,
  FaLinkedin,
} from 'react-icons/fa';

import { FaSquareXTwitter } from 'react-icons/fa6';

const FooterSection = () => {
  return (
    <footer
      style={{
        background: 'linear-gradient(to right, #876FFD, #6C59CA)',
      }}
      className="text-white py-12"
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
          <div className="flex flex-col items-start">
            <img
              src={footerLogo}
              alt="Xcellify Logo"
              className="w-10/12 h-auto mb-2"
            />
            {/* <p className="text-sm text-gray-200">Discover, Learn, Excel</p> */}
          </div>

          <div className="flex flex-wrap justify-start gap-12">
            <div>
              <h3 className="text-lg text-[#F5F5F5] font-bold font-dmsans mb-4">
                Get to know us
              </h3>
              <ul className="space-y-2 text-sm text-[#F5F5F5] font-medium font-dmsans">
                <li>
                  <a href="#about-us" className="hover:underline">
                    About us
                  </a>
                </li>
                <li>
                  <a href="#careers" className="hover:underline">
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="https://education.economictimes.indiatimes.com/news/breaking-barriers-in-education-xcellify-indias-first-comprehensive-student-marketplace-makes-high-quality-career-and-lifestyle-resources-accessible-to-every-student-in-india/117737536"
                    className="hover:underline"
                  >
                    In the news
                  </a>
                </li>
                <li>
                  <a
                    href="https://xcellify.com/PrivacyPolicy"
                    className="hover:underline"
                  >
                    Refund policy
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:underline">
                    Contact us
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg text-[#F5F5F5] font-bold font-dmsans mb-4">
                Make money with us
              </h3>
              <ul className="space-y-2 text-sm text-[#F5F5F5] font-medium font-dmsans">
                <li>
                  <a
                    href="https://partner.xcellify.com/"
                    className="hover:underline"
                  >
                    Sell on Xcellify
                  </a>
                </li>
                <li>
                  <a href="#affiliate" className="hover:underline">
                    Become an affiliate
                  </a>
                </li>
                <li>
                  <a href="#advertise" className="hover:underline">
                    Advertise your products and service
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg text-[#F5F5F5] font-bold font-dmsans mb-4">
                Connect with us
              </h3>
              <div className="flex gap-4 text-xl text-[#F5F5F5]">
                <a
                  href="https://www.facebook.com/share/17tv5Rta4h/?mibextid=LQQJ4d"
                  className="hover:text-white"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://www.instagram.com/xcellify_official/"
                  className="hover:text-white"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://www.x.com/xcellify"
                  className="hover:text-white"
                >
                  <FaSquareXTwitter />
                </a>
                <a
                  href="https://www.linkedin.com/company/xcellify"
                  className="hover:text-white"
                >
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-300 pt-4 font-medium font-dmsans text-center text-sm text-[#FFFFFF]">
          <div>
            <div className="flex flex-col md:flex-row justify-center items-center text-white text-sm space-y-2 md:space-y-0 md:space-x-28">
              <p className="text-center">
                Copyrights &copy; Xcellify Private Limited
              </p>
              <div className="flex space-x-4">
                <a
                  href="/PrivacyPolicy"
                  className="hover:underline"
                  // onClick={(e) => {
                  //   e.preventDefault();
                  //   navigate('/PrivacyPolicy');
                  // }}
                >
                  Privacy Policy
                </a>
                <span>|</span>
                <a
                  href="/TermsOfUse"
                  className="hover:underline"
                  // onClick={(e) => {
                  //   e.preventDefault();
                  //   navigate('/TermsOfUse');
                  // }}
                >
                  Terms Of Use
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
