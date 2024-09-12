'use client';

import React, { useEffect, useState, useRef, useCallback, SetStateAction, Dispatch } from 'react';
import Image from 'next/image';

interface MenuItem {
  label: string;
  icon: string;
  onClick: () => void;
}

interface SelectionPopupMenuProps {
  items: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  anchorEl: React.RefObject<HTMLElement>;
  relativeAlign?: 'above_or_below' | 'left_or_right';
  setCurrentRelativePosition: Dispatch<SetStateAction<CurrentRelativePosition>>,
}

export type CurrentRelativePosition = 'above' | 'below' | 'left' | 'right';

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

  const updatePosition = useCallback(() => {
    if (menuRef.current && anchorEl.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const anchorRect = anchorEl.current.getBoundingClientRect();
      
      let top = anchorRect.bottom;
      let left = anchorRect.left;
      let relativePosition: CurrentRelativePosition = 'below';

      if (relativeAlign === 'above_or_below') {
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
      } else if (relativeAlign === 'left_or_right') {
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
      }

      setPosition({ top, left });
      setCurrentRelativePosition(relativePosition);
    }
  }, [anchorEl, relativeAlign, setCurrentRelativePosition, setPosition]);

  useEffect(() => {
    updatePosition();
    if (isOpen) {
      window.addEventListener('resize', updatePosition);

      // Add click event listener to capture clicks outside the popup
      const handleOutsideClick = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node) && 
            anchorEl.current && !anchorEl.current.contains(event.target as Node)) {
          event.preventDefault();
          event.stopPropagation();
          onClose();
        }
      };
      document.addEventListener('click', handleOutsideClick);

      return () => {
        window.removeEventListener('resize', updatePosition);
        document.removeEventListener('click', handleOutsideClick);
      };
    }
  }, [isOpen, updatePosition, onClose, anchorEl]);

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
