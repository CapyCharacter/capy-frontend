'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useMobileContext } from '../_common/MobileDetectionProvider';
import { forceCloseAllPopups } from '@/utils/forceCloseAllPopups';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  position: 'left' | 'right';
  toggleableOnMobile: boolean;
  children: ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  setIsOpen,
  position,
  toggleableOnMobile,
  children,
}) => {
  const isMobile = useMobileContext();

  const [transitioning, setTransitioning] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setTransitioning("transition-transform duration-300 ease-in-out");
    }, 100);
  }, [isOpen]);

  return (
    <>
      <div className={`
        fixed top-0 ${position}-0 h-screen
        ${isMobile ? 'w-64' : 'w-64 md:w-72 lg:w-80'}
        bg-white shadow-md
        ${transitioning}
        ${(!isMobile || isOpen) 
          ? 'translate-x-0' 
          : position === 'left'
            ? '-translate-x-full'
            : 'translate-x-full'
        }
        z-50
      `}>
        <div className="flex flex-col h-full relative">
          {isMobile && toggleableOnMobile && (
            <button
              onClick={() => {
                setIsOpen(false);
                forceCloseAllPopups();
              }}
              className={`absolute top-4 ${position === 'left' ? 'right-4' : 'left-8'} text-gray-500 hover:text-gray-700 transition-colors duration-200`}
            >
              ✕
            </button>
          )}
          {children}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
