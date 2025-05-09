import React from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryLogo from '../../assets/logo-primary.png';

const OnBoardingHeader = ({ partnerInfo, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full shadow-md" style={{ background: 'linear-gradient(to right, #f5f3ff, #eef2ff, #f5f3ff)' }}>
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center px-4 sm:px-6 py-4">
        {/* Left Side - Logo (Navigate to Home) */}
        <div
          className="onboarding-logo cursor-pointer flex-shrink-0 transition-transform duration-300 hover:scale-105"
          onClick={() => navigate('/home')}
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
            className="profile-card flex items-center bg-white hover:bg-purple-50 transition-all duration-300 shadow-lg rounded-lg px-3 sm:px-4 py-2.5 border"
            style={{ borderColor: 'rgba(134, 110, 252, 0.3)' }}
            onClick={() => navigate('/home/profile')}
          >
            {/* Profile Icon - Modern Avatar */}
            <div className="p-1.5 rounded-full mr-3" style={{ background: 'linear-gradient(to right, #18064A, #866EFC)' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
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
            </div>

            {/* Welcome Message */}
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs">Welcome</span>
              <span className="text-sm truncate font-semibold" style={{ color: '#18064A' }}>
                {partnerInfo?.first_name || 'Partner'}
              </span>
            </div>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="text-white px-4 py-2.5 rounded-lg shadow-lg transition duration-300 transform hover:-translate-y-0.5"
            style={{ 
              background: 'linear-gradient(to right, #18064A, #866EFC)',
              boxShadow: '0 4px 6px rgba(134, 110, 252, 0.25)'
            }}
          >
            <div className="flex items-center">
              <span>Logout</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnBoardingHeader;
