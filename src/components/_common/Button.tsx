'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import SelectionPopupMenu, { CurrentRelativePosition } from './SelectionPopupMenu';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'void' | 'very_primary';
  icon?: string | React.ReactNode;
  label: string | React.ReactNode;
  iconPosition?: 'left' | 'right';
  submenuItems?: Array<{
    label: string;
    icon: string;
    onClick: () => void;
  }>;
  onClick?: () => void;
  className?: string;
  shape?: 'capsule' | 'rect';
  popupRelativeAlign?: 'left_or_right' | 'above_or_below';
  expandPopupMenuOnClick?: boolean;
  displayExpandPopupMenuIcon?: boolean;
  roundIcon?: boolean;
  centerText?: boolean;
}

const Button = ({
  variant = 'primary',
  icon,
  label,
  iconPosition = 'left',
  submenuItems,
  onClick,
  className = '',
  shape = 'rect',
  popupRelativeAlign = 'left_or_right',
  expandPopupMenuOnClick = false,
  displayExpandPopupMenuIcon = false,
  roundIcon = false,
  centerText = false,
  ...props
}: ButtonProps) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const baseClasses = 'flex items-center px-4 py-2 transition-colors duration-150 ease-in-out';
  const variantClasses = {
    primary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    secondary: 'bg-white text-gray-800 hover:bg-gray-100',
    void: 'bg-transparent text-gray-800 hover:bg-gray-100',
    very_primary: 'bg-gray-900 text-gray-100 hover:bg-gray-800',
  };
  const shapeClasses = {
    capsule: 'rounded-full',
    rect: 'rounded-md',
  };

  const handleClick = (e: React.MouseEvent) => {
    if (expandPopupMenuOnClick && submenuItems) {
      e.stopPropagation();
      setIsSubmenuOpen(!isSubmenuOpen);
    }
    if (onClick) onClick();
  };

  const handleSubmenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSubmenuOpen(!isSubmenuOpen);
  };

  const [currentRelativePosition, setCurrentRelativePosition] = useState<CurrentRelativePosition>('right');

  const getExpandIconSrc = () => {
    switch (currentRelativePosition) {
      case 'above':
        return '/images/icons/arrow-up.svg';
      case 'below':
        return '/images/icons/arrow-down.svg';
      case 'left':
        return '/images/icons/arrow-left.svg';
      case 'right':
      default:
        return '/images/icons/arrow-right.svg';
    }
  };

  const iconClasses = roundIcon ? 'rounded-full' : '';
  const iconSize = roundIcon ? 32 : 24;

  return (
    <>
      <button type="button"
        ref={buttonRef}
        className={`${baseClasses} ${variantClasses[variant]} ${shapeClasses[shape]} ${className} relative ${centerText ? 'justify-center' : ''}`}
        onClick={handleClick}
        {...props}
      >
        {icon && iconPosition === 'left' && (
          typeof icon === 'string' ? (
            <Image src={icon} alt="" width={iconSize} height={iconSize} className={`mr-2 ${iconClasses}`} />
          ) : (
            icon
          )
        )}
        <span className={centerText ? 'flex-grow text-center' : ''}>{label}</span>
        {icon && iconPosition === 'right' && (
          typeof icon === 'string' ? (
            <Image src={icon} alt="" width={iconSize} height={iconSize} className={`ml-2 ${iconClasses}`} />
          ) : (
            icon
          )
        )}
        {submenuItems && !expandPopupMenuOnClick && (
          <span className="ml-auto" onClick={handleSubmenuToggle}>
            <Image src="/images/icons/three-dots.svg" alt="Menu" width={24} height={24} />
          </span>
        )}
        {displayExpandPopupMenuIcon && (
          <Image src={getExpandIconSrc()} alt="Expand" width={24} height={24} className="ml-auto" />
        )}
      </button>
      
      {submenuItems && (
        <SelectionPopupMenu
          items={submenuItems}
          isOpen={isSubmenuOpen}
          onClose={() => setIsSubmenuOpen(false)}
          anchorEl={buttonRef}
          relativeAlign={popupRelativeAlign}
          setCurrentRelativePosition={setCurrentRelativePosition}
        />
      )}
    </>
  );
};

export default Button;
