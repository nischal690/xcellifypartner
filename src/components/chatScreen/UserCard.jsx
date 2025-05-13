import React from 'react';
const UserCard = ({ user, active, onClick }) => (
  <div
    className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 ${
      active ? 'bg-gray-100' : ''
    }`}
    onClick={onClick}
  >
    <img src={user.avatar} className="w-10 h-10 rounded-full" />
    <div className="text-sm">
      <div className="font-medium">{user.name}</div>
      <div className="text-gray-600 text-xs truncate w-40">
        {user.lastMessage}
      </div>
      <div className="text-gray-400 text-xs">
        {user.dateRange} · {user.location}
      </div>
    </div>
    <span className="ml-auto text-xs text-gray-400">{user.time}</span>
  </div>
);

export default UserCard;
