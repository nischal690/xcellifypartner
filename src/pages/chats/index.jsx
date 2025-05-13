import React, { useEffect, useState } from 'react';
import ChatHeader from '../../components/chatScreen/ChatHeader';
import Sidebar from '../../components/chatScreen/Sidebar';
import ChatWindow from '../../components/chatScreen/ChatWindow';
import MessageInput from '../../components/chatScreen/MessageInput';

import { users } from '../../components/chatScreen/data/users';
import { messages as messagesData } from '../../components/chatScreen/data/messages';
import { replies } from '../../components/chatScreen/data/replies';

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [messages, setMessages] = useState(messagesData[selectedUser.id] || []);
  const [input, setInput] = useState('');

  useEffect(() => {
    setMessages(messagesData[selectedUser.id] || []);
  }, [selectedUser]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'vendor',
      text: input,
      time: 'Now',
    };
    const updated = [...messages, newMsg];
    setMessages(updated);
    setInput('');

    const reply = replies[selectedUser.id]?.[0];
    if (reply) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), sender: 'user', text: reply.text, time: 'Later' },
        ]);
      }, reply.delay);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          selectedId={selectedUser.id}
          setSelectedUser={setSelectedUser}
        />
        <div className="flex flex-col flex-1">
          <ChatWindow user={selectedUser} messages={messages} />
          <MessageInput input={input} setInput={setInput} onSend={handleSend} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
