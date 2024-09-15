'use client';

import Image from 'next/image';
import { useMobileContext } from '../_common/MobileDetectionProvider';
import { CharacterInfo } from '@/utils/backend/schemas/CharacterInfo';
import { useEffect, useState } from 'react';
import { useAuth } from '../_common/AuthProvider';

interface CharacterInfoInChatProps {
  character: CharacterInfo | null | false;
}

const CharacterInfoInChat: React.FC<CharacterInfoInChatProps> = ({ character }) => {
  const auth = useAuth();
  const [creator, setCreator] = useState('');
  const isMobile = useMobileContext();

  const name = (character ? character.name : '');
  const description = (character ? character.description : '');
  const avatarUrl = (character ? character.avatar_url : '/images/default-user-avatar.png');

  useEffect(() => {
    if (auth.isAuthenticated && character && character.creator_user) {
      setCreator(character.creator_user.username);
    }
  }, [auth, character]);

  return (
    <div className={`
      ${isMobile 
        ? 'flex flex-row items-center p-2 fixed top-0 left-0 right-0 bg-white z-10 shadow-md w-full pl-16' 
        : 'flex flex-col items-center text-center p-4'}
    `}>
      <div className={`${isMobile ? 'w-12 h-12' : 'w-24 h-24'} relative ${isMobile ? 'mr-3' : 'mb-4'}`}>
        {avatarUrl ? <Image
          src={avatarUrl}
          alt={`${name}'s avatar`}
          layout="fill"
          objectFit="cover"
          className="rounded-full"
        /> : <div className="w-full h-full bg-gray-300 rounded-full"></div>}
      </div>
      <div className={`${isMobile ? 'flex flex-col items-start' : ''}`}>
        <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold ${isMobile ? '' : 'mb-2'}`}>{name}</h2>
        {!isMobile && (
          <p className="text-sm text-gray-600 mb-3">
            {description.length > 100 ? `${description.slice(0, 97)}...` : description}
          </p>
        )}
        <p className={`text-xs text-gray-500 ${isMobile ? '' : 'mt-1'}`}>{creator ? `by ${creator}` : ''}</p>
      </div>
    </div>
  );
};

export default CharacterInfoInChat;
