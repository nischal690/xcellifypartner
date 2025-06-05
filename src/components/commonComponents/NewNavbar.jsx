import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import navlogo from '../../assets/landingPageAssets/Images/LogoPrimary.png';

const NewNavbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLoginClick = () => {
    navigate('/login');
    //navigate('/ComingSoonPage');
    setIsMenuOpen(false);
  };

  const handleSignupClick = () => {
    navigate('/signup');
    //navigate('/ComingSoonPage');

    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          {/* Logo or Brand */}
          <div className="text-white text-lg font-bold">
            <img
              src={navlogo}
              alt="Logo"
              className="w-auto h-10 sm:h-12 md:h-14 lg:h-16 xl:h-18"
            />
          </div>

          {/* Hamburger Menu for Mobile */}
          <div className="sm:hidden">
            <button
              onClick={toggleMenu}
              aria-label="Toggle navigation"
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? (
                // Close Icon (Cross SVG)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 bg-purple-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 bg-purple-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:flex flex-1 justify-center items-center space-x-8">
            <a
              href="#why-partner"
              className="text-purple-primary text-m font-medium hover:underline"
            >
              Why Partner?
            </a>
            <a
              href="#what-to-sell"
              className="text-purple-primary text-m font-medium hover:underline"
            >
              What to Sell?
            </a>
            <a
              href="#how-to-start"
              className="text-purple-primary text-m font-medium hover:underline"
            >
              How to Start?
            </a>
            <a
              href="#faqs"
              className="text-purple-primary text-m font-medium hover:underline"
            >
              FAQs
            </a>
          </div>

          {/* Buttons */}
          <div className="hidden sm:flex space-x-4">
            <button
              className="bg-purple-primary text-white font-dmsans px-4 py-1.5 rounded-lg hover:bg-purple-disabled"
              onClick={handleSignupClick}
            >
              Sign up
            </button>
            <button
              className="bg-white text-purple-primary font-dmsans px-4 py-1.5 rounded-lg"
              onClick={handleLoginClick}
            >
              Login
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`sm:hidden mt-2 flex-col space-y-4 bg-purple-primary px-4 py-4 rounded-lg ${
            isMenuOpen ? 'flex' : 'hidden'
          }`}
        >
          <a
            href="#why-partner"
            className="text-white text-m font-medium hover:underline"
            onClick={() => setIsMenuOpen(false)}
          >
            Why partner?
          </a>
          <a
            href="#what-to-sell"
            className="text-white text-m font-medium hover:underline"
            onClick={() => setIsMenuOpen(false)}
          >
            What to Sell?
          </a>
          <a
            href="#how-to-start"
            className="text-white text-m font-medium hover:underline"
            onClick={() => setIsMenuOpen(false)}
          >
            How to Start?
          </a>
          <a
            href="#faqs"
            className="text-white text-m font-medium hover:underline"
            onClick={() => setIsMenuOpen(false)}
          >
            FAQs
          </a>
          <button
            className="bg-purple-primary text-white font-dmsans px-4 py-2 rounded-lg hover:bg-purple-disabled"
            onClick={handleSignupClick}
          >
            Sign up
          </button>
          <button
            className="bg-white text-purple-primary font-dmsans px-4 py-2 rounded-lg"
            onClick={handleLoginClick}
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NewNavbar;
