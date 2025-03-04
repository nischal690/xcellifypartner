import React from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryLogo from '../../assets/logo-primary.png';

const OnBoardingHeader = ({ partnerInfo, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full flex justify-between items-center px-6 mb-5">
      {/* Left Side - Logo (Navigate to Home) */}
      <div
        className="onboarding-logo w-fit cursor-pointer"
        onClick={() => navigate('/home/dashboard')}
      >
        <img src={PrimaryLogo} className="w-24 lg:w-32" alt="Xcellify" />
      </div>

      {/* Right Side - Profile Card + Logout Button */}
      <div className="flex items-center space-x-4">
        {/* Profile Card */}
        <buttonn
          className="profile-card"
          onClick={() => navigate('/home/profile')}
        >
          <div className="bg-white shadow-lg rounded-md px-4 py-2 flex items-center w-full">
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
          </div>
        </buttonn>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="logout-button bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default OnBoardingHeader;
