'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import Button from './Button';
import Image from 'next/image';

// Section component
interface SectionProps {
  children: ReactNode;
  title?: string;
}

const Section: React.FC<SectionProps> = ({ children, title }) => (
  <div className="w-full py-2">
    {title && <h2 className="text-base font-medium text-black mb-2 px-4">{title}</h2>}
    {children}
  </div>
);

// Subsection component
interface SubsectionProps {
  children: ReactNode;
  title: string;
}

const Subsection: React.FC<SubsectionProps> = ({ children, title }) => (
  <div className="mb-4">
    <h3 className="text-sm font-medium text-gray-500 mb-1 px-4">{title}</h3>
    {children}
  </div>
);

// Section 1: Home Button
const HomeButton = () => (
  <div className="w-full py-4 px-6">
    <Link href="/" className="inline-block text-lg font-bold transition-colors duration-200 ease-in-out hover:bg-gray-50 px-2 py-1 rounded">
      CapyCharacter.AI
    </Link>
  </div>
);

// Section 2: Create Button
const CreateButton = () => {
  const submenuItems = [
    { label: 'Character', icon: '/images/icons/new-character.svg', onClick: () => {} },
    { label: 'Voice', icon: '/images/icons/new-voice.svg', onClick: () => {} },
  ];

  return (
    <div className="px-4 py-2">
      <Button
        label="Create"
        variant="secondary"
        shape="capsule"
        icon="/images/icons/plus.svg"
        className="w-full"
        submenuItems={submenuItems}
        popupRelativeAlign="left_or_right"
        expandPopupMenuOnClick
        displayExpandPopupMenuIcon
      />
    </div>
  );
};

// Section 3: Discover Button
const DiscoverButton = () => (
  <div className="px-4 py-2">
    <Button
      label="Discover"
      variant="secondary"
      icon="/images/icons/discover.svg"
      className="w-full"
    />
  </div>
);

// Section 4: Recent Characters
const RecentCharacters = () => {
  const characters = [
    { id: 1, name: 'Character 1' },
    { id: 2, name: 'Character 2' },
    { id: 3, name: 'Character 3' },
  ];

  return (
    <div className="w-full px-4 py-2">
      {characters.map((char) => (
        <div key={char.id} className="mb-2 last:mb-0">
          <Button
            label={char.name}
            variant="void"
            icon="/images/fake-character-image.avif"
            className="w-full"
            roundIcon
          />
        </div>
      ))}
    </div>
  );
};

// Section 5: User Profile
const UserProfile = () => {
  const menuItems = [
    { label: 'Profile', icon: '/images/icons/profile.svg', onClick: () => {} },
    { label: 'Setting', icon: '/images/icons/setting.svg', onClick: () => {} },
    { label: 'Logout', icon: '/images/icons/logout.svg', onClick: () => {} },
  ];

  return (
    <div className="px-4 py-2">
      <Button
        label="Username"
        variant="secondary"
        icon="/images/icons/user.svg"
        className="w-full"
        submenuItems={menuItems}
        popupRelativeAlign="above_or_below"
        expandPopupMenuOnClick={true}
        displayExpandPopupMenuIcon={true}
      />
    </div>
  );
};

// Main Sidebar Component
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsOpen(window.innerWidth >= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className={`
          ${isMobile ? 'fixed top-3 left-3' : 'relative ml-5'}
          z-50 text-black p-2 rounded-lg
          transition-all duration-250 ease-in-out
          hover:scale-115 hover:bg-gray-200
          overflow-hidden
        `}
        style={{
          display: isOpen ? 'none' : 'block'
        }}
      >
        <Image
          src="/images/icons/three-lines.svg"
          alt="Toggle Sidebar"
          width={24}
          height={24}
          className="relative z-10"
        />
      </button>
      <div className={`
        fixed top-0 left-0 h-screen
        ${isMobile ? 'w-64' : 'w-64 md:w-72 lg:w-80'}
        bg-white shadow-md
        ${isOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'}
        z-50
      `}>
        <div className="flex flex-col h-full relative">
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              ✕
            </button>
          )}
          <HomeButton />
          <CreateButton />
          <DiscoverButton />
          <div className="flex-grow overflow-y-auto">
            <Section title="Conversations">
              <Subsection title="Recent">
                <RecentCharacters />
              </Subsection>

              <Subsection title="This Week">
                <RecentCharacters />
              </Subsection>
            </Section>
          </div>
          <div className="mt-auto mb-4">
            <UserProfile />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
