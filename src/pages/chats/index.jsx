import React, { lazy, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiRequest from '../../utils/apiRequest';
import ChatHeader from '../../components/chatScreen/ChatHeader';
import Sidebar from '../../components/chatScreen/Sidebar';
import ChatWindow from '../../components/chatScreen/ChatWindow';
import MessageInput from '../../components/chatScreen/MessageInput';
import { useStore } from '../../stores';
import { toJS } from 'mobx';
import useIsMobile from '../../utils/useIsMobile';

export default function MyChatsPage() {
  const navigate = useNavigate();
  const { appStore } = useStore();

  const isMobile = useIsMobile();

  const { id: conversationId } = useParams();

  const [userId, setUserId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const resolvedUserId = toJS(appStore?.partnerInfo?.user_id);
    setUserId(resolvedUserId);
  }, [appStore?.partnerInfo?.user_id]);

  useEffect(() => {
    if (!userId) return;

    const fetchConversations = async () => {
      try {
        const response = await apiRequest({
          url: '/mic-login/messaging/conversations',
          method: 'get',
        });

        const allConvs = response?.data?.data || [];
        const transformed = allConvs.map((conv) => ({
          conversationId: conv.id,
          userId: conv.seller_user_id,
          name: `User ${conv.seller_user_id}`,
          lastMessage: conv.last_message_preview,
        }));

        setConversations(transformed);

        const match = transformed.find(
          (u) => u.conversationId === conversationId
        );
        if (match) {
          setSelectedUser(match);
          fetchMessages(match.conversationId);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
      }
    };

    const fetchMessages = async (convId) => {
      try {
        const currentUserId = toJS(appStore?.partnerInfo?.user_id);

        const response = await apiRequest({
          url: `/mic-login/messaging/conversations/${convId}/messages`,
          method: 'get',
        });

        const raw = response?.data?.data || [];

        const parsed = raw.map((msg) => {
          const isSender = String(msg.sender_user_id) === String(currentUserId);
          return {
            id: msg.id,
            sender: isSender ? 'sent' : 'received',
            text: msg.content,
            time: new Date(msg.created_at).toLocaleTimeString(),
          };
        });

        setMessages(parsed);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchConversations();
  }, [conversationId, userId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const content = input.trim();

    try {
      const response = await apiRequest({
        url: `/mic-login/messaging/conversations/${conversationId}/messages`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data: { content },
      });

      const currentUserId = toJS(appStore?.partnerInfo?.user_id);

      const newMsg = {
        id: response.data.data.id,
        sender: 'sent',
        text: content,
        time: new Date(response.data.data.created_at).toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, newMsg]);
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error?.response?.data || error);
    }
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="p-5 w-full">
          <div className="flex flex-col h-[calc(100vh-160px)] mt-5">
            <ChatHeader />
            {isMobile ? (
              !selectedUser ? (
                <Sidebar
                  users={conversations}
                  selectedId={null}
                  onSelectUser={(user) => {
                    setSelectedUser(user);
                    navigate(`/home/chats/${user.conversationId}`);
                  }}
                />
              ) : (
                <div className="flex flex-col flex-1 h-[calc(100vh-160px)] overflow-hidden">
                  {/* Back button for mobile */}
                  <div className="bg-white px-4 py-2 border-b shrink-0">
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="text-blue-600 text-sm"
                    >
                      ← Back to Chats
                    </button>
                  </div>

                  {/* Scrollable Chat */}
                  <div className="flex-1 overflow-hidden flex flex-col">
                    <ChatWindow user={selectedUser} messages={messages} />
                  </div>

                  {/*  Message Input */}
                  <div className="shrink-0">
                    <MessageInput
                      input={input}
                      setInput={setInput}
                      onSend={handleSend}
                    />
                  </div>
                </div>
              )
            ) : (
              // Desktop layout
              <div className="flex flex-1 overflow-hidden">
                <Sidebar
                  users={conversations}
                  selectedId={selectedUser?.userId}
                  onSelectUser={(user) => {
                    setSelectedUser(user);
                    setMessages([]);
                    navigate(`/home/chats/${user.conversationId}`);
                  }}
                />
                <div className="flex flex-col flex-1 h-full">
                  {selectedUser ? (
                    <>
                      <div className="flex-1 overflow-hidden flex flex-col">
                        <ChatWindow user={selectedUser} messages={messages} />
                      </div>
                      <MessageInput
                        input={input}
                        setInput={setInput}
                        onSend={handleSend}
                      />
                    </>
                  ) : (
                    <div className="text-gray-500 p-8">
                      Select a conversation to begin
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
