'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import CharacterInfoInChat from '@/components/chatbox/CharacterInfoInChat';
import { useMobileContext } from '@/components/_common/MobileDetectionProvider';
import MessageInput from '@/components/chatbox/MessageInput';
import Message from '@/components/chatbox/Message';
import { useAuth } from '@/components/_common/AuthProvider';
import { callAIService } from '@/utils/backend/callAIService';
import { callGetConversationByCharacter } from '@/utils/backend/callGetConversationByCharacter';
import { ConversationInfo } from '@/utils/backend/schemas/ConversationInfo';
import { callGetMessagesByConversation } from '@/utils/backend/CallGetMessagesByConversation';
import { callCharacterGetById } from '@/utils/backend/callCharacterGetById';
import UnauthenticatedPage from '@/components/_common/UnauthenticatedPage';
import { VoiceCallFullscreen } from '@/components/VoiceCall/VoiceCall';

interface ChatPageProps {
  params: { character_id: string };
}

interface MessageData {
  content: string;
  sentByUser: boolean;
  id: number | null;
}

const ChatPage: React.FC<ChatPageProps> = ({ params: { character_id } }) => {
  const auth = useAuth();

  const [isVoiceCalling, setIsVoiceCalling] = useState(false);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [firstMessageContentByAI, setFirstMessageContentByAI] = useState<string>('');
  const [latestMessageContentByAI, setLatestMessageContentByAI] = useState<string>('');
  const isMobile = useMobileContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversation, setConversation] = useState<ConversationInfo | null | false>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const [waitingForFirstResponseByte, setWaitingForFirstResponseByte] = useState<boolean>(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!auth.isAuthenticated) {
      return;
    }

    if (isVoiceCalling) {
      return;
    }

    const numericCharacterId = parseInt(character_id, 10);
    if (isNaN(numericCharacterId)) {
      setConversation(false);
      return;
    }
    callCharacterGetById({ characterId: numericCharacterId }).then((character) => {
      if (character instanceof Error) {
        console.error(character.message);
        setConversation(false);
        return;
      }
      setFirstMessageContentByAI(character.greeting);
    }).catch((error) => {
      console.error(error);
      setConversation(false);
    });

    callGetConversationByCharacter({ characterId: numericCharacterId }).then((conversation) => {
      if (conversation instanceof Error) {
        console.error(conversation.message);
        setConversation(false);
        return;
      }

      setConversation(conversation);

      callGetMessagesByConversation({ conversationId: conversation.id }).then((messages) => {
        if (messages instanceof Error) {
          console.error(messages.message);
          setConversation(false);
          return;
        }

        setMessages(messages.map((message) => ({ content: message.content, sentByUser: message.sent_by_user, id: message.id })));
        scrollToBottom();
      }).catch((error) => {
        console.error(error);
        setConversation(false);
      });
    }).catch((error) => {
      console.error(error);
      setConversation(false);
    });
  }, [auth, character_id, isVoiceCalling]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, latestMessageContentByAI]);

  const getResponseMessageFromAI = useCallback((userMessage: string) => {
    if (!auth.isAuthenticated || !conversation) {
      return;
    }

    setWaitingForFirstResponseByte(true);

    let latestMessageContent = "";
    callAIService({
      conversation_id: conversation.id,
      type: "LLM",
      latest_message_content: userMessage,
      token: auth.token,
    }, (output) => {
      setWaitingForFirstResponseByte(false);
      if (output.is_finished === true) {
        if (output.error === false) {
          if ('new_data' in output) {
            latestMessageContent += output.new_data;
          }
          setMessages(previousMessages => [...previousMessages, { content: latestMessageContent, sentByUser: false, id: null }]);
        } else {
          setMessages(previousMessages => [...previousMessages, { content: output.error, sentByUser: false, id: null }]);
        }
        setLatestMessageContentByAI('');
      } else {
        if ('new_data' in output) {
          latestMessageContent += output.new_data;
        }
        setLatestMessageContentByAI(latestMessageContent);
      }
    });
  }, [conversation, auth, setLatestMessageContentByAI, setMessages, setWaitingForFirstResponseByte]);

  const handleSendMessage = useCallback((userMessage: string) => {
    if (!auth.isAuthenticated || !conversation) {
      return;
    }

    getResponseMessageFromAI(userMessage);

    setMessages(previousMessages => [...previousMessages, { content: userMessage, sentByUser: true, id: null }]);
  }, [conversation, auth, getResponseMessageFromAI, setMessages]);

  return auth.isAuthenticated ? (<>
    <div className="flex flex-col h-screen">
      <div className="flex flex-col h-full max-w-4xl w-full mx-auto relative">
        <div className="relative overflow-auto mb-20">
          <div className={`flex-grow overflow-y-auto p-4 ${isMobile ? 'mt-16' : ''}`}>
            <CharacterInfoInChat
                character={conversation ? conversation.character : conversation}
            />
            {firstMessageContentByAI && (
              <Message
                messageId={null}
                content={firstMessageContentByAI}
                avatarSrc={(conversation && conversation.character && conversation.character.avatar_url) || "/images/default-user-avatar.png"}
                senderName={(conversation && conversation.character && conversation.character.name) || "Unknown"}
                sentByUser={false}
              />
            )}
            {messages.map((message, index) => (
              <Message
                key={index}
                messageId={message.id ? message.id.toString() : null}
                content={message.content}
                avatarSrc={message.sentByUser
                  ? (auth.isAuthenticated === true && auth.user.avatar_url ? auth.user.avatar_url : "/images/default-user-avatar.png")
                  : (conversation && conversation.character && conversation.character.avatar_url ? conversation.character.avatar_url : "/images/default-user-avatar.png")}
                senderName={message.sentByUser ? "You" : (conversation && conversation.character && conversation.character.name ? conversation.character.name : "Unknown")}
                sentByUser={message.sentByUser}
              />
            ))}
            <div ref={messagesEndRef} />
            {latestMessageContentByAI && (
              <Message
                messageId={null}
                content={latestMessageContentByAI}
                avatarSrc={(conversation && conversation.character && conversation.character.avatar_url) ? conversation.character.avatar_url : "/images/default-user-avatar.png"}
                senderName={(conversation && conversation.character && conversation.character.name) ? conversation.character.name : "Unknown"}
                sentByUser={false}
              />
            )}
            {waitingForFirstResponseByte && (
              <div className="flex items-center space-x-1 mt-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounceCustom"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounceCustom" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounceCustom" style={{ animationDelay: '0.4s' }}></div>
              </div>
            )}
          </div>
        </div>
        <div className="w-full absolute bottom-0">
          <div className="p-4 w-full">
            <MessageInput onSendMessage={handleSendMessage} startVoiceCall={() => {
              const newAudioContext = new AudioContext();

              newAudioContext.resume();


              const oscillator = newAudioContext.createOscillator(); // Example of creating an oscillator
              const gainNode = newAudioContext.createGain();

              oscillator.connect(gainNode);
              gainNode.connect(newAudioContext.destination);

              oscillator.frequency.value = 440; // Set frequency to 440 Hz
              gainNode.gain.value = 0.5; // Set volume to 50%

              oscillator.start();

              setAudioContext(newAudioContext);
              setIsVoiceCalling(true);
            }} />
          </div>
        </div>
      </div>
    </div>

    {<VoiceCallFullscreen
      conversation={conversation}
      audioContext={audioContext}
      onClose={() => {
        setIsVoiceCalling(false);
        setAudioContext(null);
      }}
      open={isVoiceCalling}
    />}
    
  </>) : (
    <UnauthenticatedPage />
  );
};

export default ChatPage;
