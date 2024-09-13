'use client';

import React, { useEffect, useState, useRef, useCallback, SetStateAction, Dispatch } from 'react';
import Image from 'next/image';
import { subscribeToCloseAllPopups } from '@/utils/forceCloseAllPopups';

interface MenuItem {
  label: string;
  icon: string;
  onClick: () => void;
}

export type RelativeAlign = 'above_or_below' | 'left_or_right';

interface SelectionPopupMenuProps {
  items: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  anchorEl: React.RefObject<HTMLElement>;
  relativeAlign?: RelativeAlign;
  setCurrentRelativePosition: Dispatch<SetStateAction<CurrentRelativePosition>>,
}

export type CurrentRelativePosition = 'above' | 'below' | 'left' | 'right';

const POPUP_STATE_CHANGE_EVENT = 'popupStateChange';

const SelectionPopupMenu: React.FC<SelectionPopupMenuProps> = ({ 
  items, 
  isOpen, 
  onClose, 
  className = '', 
  anchorEl, 
  relativeAlign = 'above_or_below',
  setCurrentRelativePosition, 
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((customRelativeAlign: null|RelativeAlign = null) => {
    if (null === customRelativeAlign) {
      customRelativeAlign = relativeAlign;
    }

    if (menuRef.current && anchorEl.current) {
      console.log('updatePosition');
      const menuRect = menuRef.current.getBoundingClientRect();
      const anchorRect = anchorEl.current.getBoundingClientRect();
      
      let top = anchorRect.bottom;
      let left = anchorRect.left;
      let relativePosition: CurrentRelativePosition = 'below';

      if (customRelativeAlign === 'above_or_below') {
        // Adjust position if menu goes off screen vertically
        if (top + menuRect.height > window.innerHeight) {
          top = anchorRect.top - menuRect.height;
          relativePosition = 'above';
        } else {
          relativePosition = 'below';
        }
        // Center horizontally
        left = anchorRect.left + (anchorRect.width / 2) - (menuRect.width / 2);
        // Adjust if off screen horizontally
        if (left + menuRect.width > window.innerWidth) {
          left = window.innerWidth - menuRect.width;
        }
        if (left < 0) {
          left = 0;
        }
      } else if (customRelativeAlign === 'left_or_right') {
        // Position to the right by default
        left = anchorRect.right;
        relativePosition = 'right';
        // If off screen, position to the left
        if (left + menuRect.width > window.innerWidth) {
          left = anchorRect.left - menuRect.width;
          relativePosition = 'left';
        }
        // Center vertically
        top = anchorRect.top + (anchorRect.height / 2) - (menuRect.height / 2);
        // Adjust if off screen vertically
        if (top + menuRect.height > window.innerHeight) {
          top = window.innerHeight - menuRect.height;
        }
        if (top < 0) {
          top = 0;
        }

        if (left + menuRect.width > window.innerWidth || left < 0) {
          // Adjust to keep popup within window
          return updatePosition('above_or_below');
        }
      }

      setPosition({ top, left });
      setCurrentRelativePosition(relativePosition);
    }
  }, [menuRef, anchorEl, relativeAlign, setCurrentRelativePosition, setPosition]);

  useEffect(() => {
    window.addEventListener('resize', () => updatePosition());
    return () => {
      window.removeEventListener('resize', () => updatePosition());
    };
  }, [updatePosition]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === POPUP_STATE_CHANGE_EVENT) {
        setTimeout(() => {
          console.log('updatePosition FINAL');
          updatePosition();
        }, 200);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [updatePosition]);

  useEffect(() => {
    window.postMessage({ type: POPUP_STATE_CHANGE_EVENT, isOpen }, '*');

    if (isOpen) {
      // Add click event listener to capture clicks outside the popup
      const handleOutsideClick = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          onClose();
        }
      };
      document.addEventListener('click', handleOutsideClick);

      return () => {
        document.removeEventListener('click', handleOutsideClick);
      };
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    const unsubscribe = subscribeToCloseAllPopups(() => {
      if (isOpen) {
        onClose();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isOpen, onClose]);

  return (
    <div
      ref={menuRef}
      className={`fixed bg-white rounded-xl shadow-lg border border-gray-200 p-2 ${className}`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999,
        minWidth: '220px',
        opacity: isOpen ? 1 : 0,
        transition: 'all 0.2s ease-in-out',
      }}
    >
      {items.map((item, index) => (
        <button
          key={index}
          className="flex items-center w-full px-4 py-2 mb-1 last:mb-0 text-left hover:bg-gray-100 transition-colors duration-150 ease-in-out rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            item.onClick();
            onClose();
          }}
        >
          <Image src={item.icon} alt={item.label} width={20} height={20} className="mr-4" />
          <span className="text-sm">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SelectionPopupMenu;
