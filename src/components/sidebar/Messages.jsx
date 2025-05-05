import React, { useState } from 'react';
import { RiMailLine, RiMailOpenLine, RiCloseLine } from 'react-icons/ri';
import MessageItem from './MessageItem';
import { useStore } from '../../stores';

export default function Messages() {
  const { messageStore } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    messageStore.markAsRead(message.id);
  };

  const handleClose = () => {
    setSelectedMessage(null);
  };

  const handleMarkAllAsRead = () => {
    messageStore.markAllAsRead();
  };

  return (
    <div className="border-t border-gray-200">
      {/* Messages List Toggle */}
      <div 
        className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <span className="text-sm font-medium">{isExpanded ? 'Hide Messages' : 'Show Messages'}</span>
        </div>
        {messageStore.unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {messageStore.unreadCount}
          </span>
        )}
      </div>

      {/* Messages List */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          <div className="flex justify-between items-center p-2 bg-gray-50">
            <span className="text-sm font-medium">Recent Messages</span>
            {messageStore.unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {messageStore.allMessages.length > 0 ? (
              messageStore.allMessages.map(message => (
                <MessageItem 
                  key={message.id} 
                  message={message} 
                  onClick={handleMessageClick} 
                />
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No messages yet
              </div>
            )}
          </div>
        </div>
      )}

      {/* Message Detail View */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-medium">Message from {selectedMessage.sender}</h3>
              <button 
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <RiCloseLine size={24} />
              </button>
            </div>
            <div className="p-4">
              <p className="mb-4">{selectedMessage.content}</p>
              <div className="text-sm text-gray-500 text-right">
                {new Date(selectedMessage.timestamp).toLocaleString()}
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button 
                onClick={handleClose}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
