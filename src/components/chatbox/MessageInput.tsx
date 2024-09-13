"use client";

import { useState, useRef, useEffect } from "react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [inputMessage, setInputMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // const [_isOneLine, setIsOneLine] = useState(true);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage("");
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 127);
      textareaRef.current.style.height = `${newHeight}px`;
      // setIsOneLine(newHeight <= 47);
    }
  }, [inputMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white p-4">
      <div className="max-w-4xl mx-auto relative">
        <textarea
          ref={textareaRef}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-3 pl-5 pr-16 border rounded-3xl resize-none overflow-hidden focus:border-gray-400 focus:outline-none"
          placeholder="Type a message..."
          rows={1}
          style={{ minHeight: '47px', maxHeight: '127px' }} // Increased both min and max height by 1px
        />
        <button
          onClick={handleSendMessage}
          className={`absolute right-1 bottom-2 w-9 h-9 bg-black rounded-full flex items-center justify-center`} // Increased button sizes by 1px
        >
            <div className="opacity-100">
              <svg viewBox="0 0 24 24" fill="none" height="1.25em" color="white">
                <path d="M3.113 6.178C2.448 4.073 4.64 2.202 6.615 3.19l13.149 6.575c1.842.921 1.842 3.55 0 4.472l-13.15 6.575c-1.974.987-4.166-.884-3.501-2.99L4.635 13H9a1 1 0 1 0 0-2H4.635z" fill="currentColor" />
              </svg>
            </div>
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
