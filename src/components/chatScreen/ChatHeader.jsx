import React from 'react';

const ChatHeader = () => (
  <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm">
    <div className="text-blue-primary font-bold text-xl">Vendor Chat Room</div>
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600">Vendor Dashboard</span>
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
        <img
          src="https://i.pravatar.cc/50"
          alt="Profile"
          className="rounded-full w-8 h-8"
        />
      </div>
    </div>
  </div>
);

export default ChatHeader;
