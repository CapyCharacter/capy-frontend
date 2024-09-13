'use client';

import React, { useState, useEffect, useRef } from 'react';
import CharacterInfoInChat from '@/components/chatbox/CharacterInfoInChat';
import { useMobileContext } from '@/components/_common/MobileDetectionProvider';
import MessageInput from '@/components/chatbox/MessageInput';
import Message from '@/components/chatbox/Message';

interface ChatPageProps {
  params: { conversation_id: string };
}

interface MessageData {
  content: string;
  sentByUser: boolean;
}

const ChatPage: React.FC<ChatPageProps> = ({ params: { conversation_id } }) => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const isMobile = useMobileContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // TODO: Fetch messages for the given conversation_id
    // This is a placeholder, replace with actual API call
    setMessages(previousMessages => [ ...previousMessages, { content: 'Welcome to the chat!', sentByUser: false }]);

    // const numericConversationId = parseInt(conversation_id, 10);
  }, [conversation_id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (message: string) => {
    setMessages([...messages, { content: message, sentByUser: true }]);
    // TODO: Send message to API
  };

  return (
    <div className="flex flex-col h-screen">
      <CharacterInfoInChat
        name="John Doe"
        creator="Jane Doe"
        description="This is a test character"
        avatarUrl="/images/fake-character-image.avif"
      />
      <div className="flex flex-col h-full">
        <div className={`flex-grow overflow-y-auto p-4 ${isMobile ? 'mt-16' : ''}`}>
          {messages.map((message, index) => (
            <Message
              key={index}
              content={message.content}
              avatarSrc={message.sentByUser ? "/images/fake-character-image.avif" : "/images/fake-character-image.avif"}
              senderName={message.sentByUser ? "You" : "John Doe"}
              sentByUser={message.sentByUser}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="sticky bottom-0 bg-white">
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
