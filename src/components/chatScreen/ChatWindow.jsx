import React, { useEffect, useRef } from 'react';

const ChatWindow = ({ user, messages }) => {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);
  return (
    <div className="flex-1 bg-chat-bg flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white shadow-sm shrink-0">
        <h3 className="text-lg font-semibold">{user.name}</h3>
        <p className="text-xs text-gray-400">Translation on</p>
      </div>

      {/* chat history */}
      <div
        ref={scrollContainerRef}
        className="flex-1 p-6 overflow-y-auto space-y-4"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === 'sent' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-sm px-4 py-2 rounded-lg ${
                msg.sender === 'sent'
                  ? 'bg-gray-100'
                  : 'bg-blue-primary text-white'
              }`}
            >
              {msg.text}
              <div className="text-[10px] text-right mt-1 text-gray-400">
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-xs text-gray-400 text-center py-2 border-t bg-white shrink-0">
        🕓 Typical response time: 20 minutes
      </div>
    </div>
  );
};

export default ChatWindow;
