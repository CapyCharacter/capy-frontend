import React, { useState } from 'react';
import Image from 'next/image';
import { BACKEND_URL } from '@/utils/env';

interface MessageProps {
  content: string;
  avatarSrc: string;
  senderName: string;
  sentByUser: boolean;
  messageId: string | null;
}

const Message: React.FC<MessageProps> = ({ content, avatarSrc, senderName, sentByUser, messageId }) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  return (
    <div className={`flex flex-col mb-4 ${sentByUser ? 'items-end ml-20' : 'items-start mr-20'}`}>
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
          <button type="button" className="bg-blue-500 rounded-full p-1 ml-2" onClick={async () => {
            if (!audio) {
              const response = await fetch(`${BACKEND_URL}/api/tts`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: content }),
                credentials: 'include',
              });

              if (!response.ok) {
                console.error('Failed to fetch audio');
                return;
              }

              const data = await response.json();
              const audioBase64 = data.audio;
              const audioData = atob(audioBase64);
              const arrayBuffer = new ArrayBuffer(audioData.length);
              const uintArray = new Uint8Array(arrayBuffer);
              for (let i = 0; i < audioData.length; i++) {
                uintArray[i] = audioData.charCodeAt(i);
              }
              const audioBlob = new Blob([arrayBuffer], { type: 'audio/mp3' });
              const audioURL = URL.createObjectURL(audioBlob);
              const newAudio = new Audio(audioURL);
              setAudio(newAudio);
              newAudio.play();
            } else {
              audio.pause();
              audio.currentTime = 0;
              audio.play();
            }
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="12" height="12">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}
      </div>
      <div className={`p-3 rounded-lg break-words inline-block ${sentByUser ? 'bg-blue-500 text-white' : 'bg-white'}`}>
        <p className={`${sentByUser ? 'text-white' : 'text-gray-800'}`} dangerouslySetInnerHTML={{ __html: content.replaceAll('\n', '<br />') }} />
      </div>
    </div>
  );
};

export default Message;
