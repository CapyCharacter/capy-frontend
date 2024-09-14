'use client';

import { CharacterInfo } from '@/utils/backend/schemas/CharacterInfo';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
interface CharacterCardProps {
  character: CharacterInfo;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  const truncateText = (text: string, maxLines: number) => {
    const words = text.split(' ');
    let result = '';
    let lines = 1;

    for (const word of words) {
      if (lines > maxLines) break;
      if ((result + word).split('\n').length > lines) {
        lines++;
      }
      result += (result ? ' ' : '') + word;
    }

    return result.length < text.length ? result.trim() + '...' : result;
  };

  const truncateCreator = (creator: string) => {
    if (creator.length > 20) {
      return creator.slice(0, 17) + '...';
    }
    return creator;
  };

  const handleClick = () => {
    if (!isDragging) {
      router.push(`/chat/${character.id}`);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartPos.current) {
      const dx = Math.abs(e.clientX - dragStartPos.current.x);
      const dy = Math.abs(e.clientY - dragStartPos.current.y);
      if (dx > 5 || dy > 5) {
        setIsDragging(true);
      }
    }
  };

  const handleMouseUp = () => {
    dragStartPos.current = null;
  };

  return (
    <div 
      className="flex bg-white rounded-lg shadow-md overflow-hidden w-64 max-w-full h-32 cursor-pointer select-none"
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="w-1/3 relative m-3">
        <Image src={character.avatar_url || "/images/icons/default-user-avatar.png"} alt={`${character.name}'s avatar`} layout="fill" objectFit="cover" className="rounded-lg" draggable="false" />
      </div>
      <div className="w-2/3 p-2 flex flex-col justify-between">
        <div>
          <h2 className="text-base font-bold mb-0.5 break-words whitespace-nowrap overflow-hidden text-ellipsis">{character.name}</h2>
          <p className="text-xs text-gray-500 mb-1 break-words whitespace-nowrap overflow-hidden text-ellipsis">by {truncateCreator("Admin")}</p>
          <p className="text-xs text-gray-700 mb-2 break-words whitespace-normal line-clamp-2">{truncateText(character.description, 2)}</p>
        </div>
        <div className="flex items-center flex-wrap mt-1">
          <Image src="/images/icons/chat-bubble.svg" alt="Chat icon" width={12} height={12} className="mr-1" draggable="false" />
          <span className="text-xs text-gray-500 break-words whitespace-normal line-clamp-2">{character.num_chats}</span>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
