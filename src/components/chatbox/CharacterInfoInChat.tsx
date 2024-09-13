'use client';

import Image from 'next/image';
import { useMobileContext } from '../_common/MobileDetectionProvider';

interface CharacterInfoInChatProps {
  name: string;
  creator: string;
  description: string;
  avatarUrl: string;
}

const CharacterInfoInChat: React.FC<CharacterInfoInChatProps> = ({
  name,
  creator,
  description,
  avatarUrl,
}) => {
  const isMobile = useMobileContext();

  return (
    <div className={`
      ${isMobile 
        ? 'flex flex-row items-center p-2 fixed top-0 left-0 right-0 bg-white z-10 shadow-md w-full pl-16' 
        : 'flex flex-col items-center text-center p-4'}
    `}>
      <div className={`${isMobile ? 'w-12 h-12' : 'w-24 h-24'} relative ${isMobile ? 'mr-3' : 'mb-4'}`}>
        <Image
          src={avatarUrl}
          alt={`${name}'s avatar`}
          layout="fill"
          objectFit="cover"
          className="rounded-full"
        />
      </div>
      <div className={`${isMobile ? 'flex flex-col items-start' : ''}`}>
        <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold ${isMobile ? '' : 'mb-2'}`}>{name}</h2>
        {!isMobile && (
          <p className="text-sm text-gray-600 mb-3">
            {description.length > 100 ? `${description.slice(0, 97)}...` : description}
          </p>
        )}
        <p className={`text-xs text-gray-500 ${isMobile ? '' : 'mt-1'}`}>by {creator}</p>
      </div>
    </div>
  );
};

export default CharacterInfoInChat;
