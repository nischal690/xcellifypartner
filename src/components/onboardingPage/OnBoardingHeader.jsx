import React from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryLogo from '../../assets/logo-primary.png';

const OnBoardingHeader = ({ partnerInfo, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full flex flex-wrap justify-between items-center px-4 sm:px-6 py-4">
      {/* Left Side - Logo (Navigate to Home) */}
      <div
        className="onboarding-logo cursor-pointer flex-shrink-0"
        onClick={() => navigate('/home/dashboard')}
      >
        <img
          src={PrimaryLogo}
          className="w-28 sm:w-32 lg:w-36"
          alt="Xcellify"
        />
      </div>

      {/* Right Side - Profile Card + Logout Button */}
      <div className="flex items-center space-x-3 sm:space-x-5 mt-3 sm:mt-0">
        {/* Profile Card */}
        <button
          className="profile-card flex items-center bg-white shadow-md rounded-md px-3 sm:px-4 py-2 w-full max-w-xs"
          onClick={() => navigate('/home/profile')}
        >
          {/* Profile Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"></path>
            <path d="M21 20c0-2.67-5.33-4-9-4s-9 1.33-9 4"></path>
          </svg>

          {/* Welcome Message */}
          <span className="text-gray-700 font-medium text-sm truncate">
            Welcome, {partnerInfo?.first_name || 'Partner'}
          </span>
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default OnBoardingHeader;
