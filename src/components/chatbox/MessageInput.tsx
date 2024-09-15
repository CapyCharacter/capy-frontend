"use client";

import { useState, useRef, useEffect } from "react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  startVoiceCall: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, startVoiceCall }) => {
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

  useEffect(() => {
    // Autofocus on page load
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (<>
    <div className="max-w-4xl mx-auto relative flex items-end">
      <div className="relative flex-grow">
        <textarea
          ref={textareaRef}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-3 pl-5 pr-16 border rounded-3xl resize-none overflow-hidden focus:border-gray-400 focus:outline-none"
          placeholder="Type a message..."
          rows={1}
          style={{ minHeight: '47px', maxHeight: '127px' }}
        />
        <button type="button"
          onClick={handleSendMessage}
          className={`absolute right-1 bottom-1 w-10 h-10 bg-black rounded-full flex items-center justify-center`}
        >
          <div className="opacity-100">
            <svg viewBox="0 0 24 24" fill="none" height="1.25em" color="white">
              <path d="M3.113 6.178C2.448 4.073 4.64 2.202 6.615 3.19l13.149 6.575c1.842.921 1.842 3.55 0 4.472l-13.15 6.575c-1.974.987-4.166-.884-3.501-2.99L4.635 13H9a1 1 0 1 0 0-2H4.635z" fill="currentColor" />
            </svg>
          </div>
        </button>
      </div>
      <CallButton onClick={startVoiceCall} />
    </div>
  </>);
};

export default MessageInput;

const CallButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button type="button"
      className="ml-2 mb-1 w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:text-white border border-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="0" className="w-5 h-5">
        <path d="M6.754 3C4.738 3 2.866 4.684 3.25 6.91c1.218 7.058 6.784 12.624 13.841 13.842 2.226.384 3.91-1.489 3.91-3.504a3.75 3.75 0 0 0-2.674-3.594l-.994-.299a2.83 2.83 0 0 0-2.81.709c-.266.266-.609.283-.826.149a12.1 12.1 0 0 1-3.908-3.908c-.135-.218-.118-.56.149-.827a2.83 2.83 0 0 0 .708-2.81l-.298-.994A3.75 3.75 0 0 0 6.754 3" fill="currentColor" />
      </svg>
    </button>
  );
};
