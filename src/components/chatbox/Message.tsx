import React from 'react';
import Image from 'next/image';

interface MessageProps {
  content: string;
  avatarSrc: string;
  senderName: string;
  sentByUser: boolean;
}

const Message: React.FC<MessageProps> = ({ content, avatarSrc, senderName, sentByUser }) => {
  return (
    <div className={`flex flex-col mb-4 ${sentByUser ? 'items-end' : 'items-start'}`}>
      <div className={`flex items-center mb-1 ${sentByUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <Image
          src={avatarSrc}
          alt={`${senderName}'s avatar`}
          width={24}
          height={24}
          className={`rounded-full ${sentByUser ? 'ml-2' : 'mr-2'}`}
        />
        <span className={`text-sm font-medium text-gray-700 ${sentByUser ? 'mr-2' : 'ml-2'}`}>{senderName}</span>
        {!sentByUser && (
          <button className="bg-blue-500 rounded-full p-1 ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="12" height="12">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}
      </div>
      <div className={`p-3 rounded-lg break-words inline-block ${sentByUser ? 'bg-blue-500 text-white' : 'bg-white'}`}>
        <p className={`${sentByUser ? 'text-white' : 'text-gray-800'}`}>{content}</p>
      </div>
    </div>
  );
};

export default Message;
