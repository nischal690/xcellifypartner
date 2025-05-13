import React from 'react';
const MessageInput = ({ input, setInput, onSend }) => (
  <div className="p-4 bg-white border-t border-gray-200 flex items-center gap-2">
    <input
      className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none"
      placeholder="Write a message..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />
    <button
      onClick={onSend}
      className="bg-purple-primary text-white px-4 py-2 rounded-full text-sm hover:bg-blue-primary"
    >
      Send
    </button>
  </div>
);

export default MessageInput;
