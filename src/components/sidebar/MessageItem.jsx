import React from 'react';
import { format } from 'date-fns';

export default function MessageItem({ message, onClick }) {
  const { sender, content, timestamp, read } = message;
  
  // Format the timestamp to a readable format
  const formattedTime = format(new Date(timestamp), 'MMM d, h:mm a');
  
  return (
    <div 
      onClick={() => onClick(message)}
      className={`flex flex-col p-3 border-b cursor-pointer transition-colors hover:bg-purple-50 ${!read ? 'bg-blue-50' : ''}`}
    >
      <div className="flex justify-between items-start">
        <span className={`font-medium ${!read ? 'font-semibold text-blue-700' : 'text-gray-800'}`}>
          {sender}
        </span>
        <span className="text-xs text-gray-500">{formattedTime}</span>
      </div>
      <p className={`text-sm mt-1 line-clamp-2 ${!read ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
        {content}
      </p>
    </div>
  );
}
