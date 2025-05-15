import React from 'react';
import profilePlaceholderImage from '../../assets/profilePlaceholder.png';

const ChatHeader = () => (
  <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm">
    <div className="text-blue-primary font-bold text-xl">Vendor Chat Room</div>
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600">My Profile</span>
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
        <img
          src={profilePlaceholderImage}
          alt="Profile"
          className="rounded-full w-8 h-8"
        />
      </div>
    </div>
  </div>
);

export default ChatHeader;
