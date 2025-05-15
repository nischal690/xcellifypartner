import React from 'react';
const UserCard = ({ user, active, onClick }) => (
  <div
    className={`p-4 cursor-pointer hover:bg-gray-100 ${
      active ? 'bg-gray-200' : ''
    }`}
    onClick={onClick}
  >
    <div className="font-semibold">{user.name}</div>
    <div className="text-xs text-gray-500 truncate overflow-hidden whitespace-nowrap w-full">
      Last Message: {user.lastMessage || 'No message yet'}
    </div>
  </div>
);

export default UserCard;
