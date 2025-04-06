'use client';

import { cn } from '@/common/utils';
import { useState } from 'react';

interface ToggleProps {
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export const Toggle = ({
  className,
  defaultChecked = false,
  onChange,
  disabled = false,
  ...props
}: ToggleProps) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleClick = () => {
    if (disabled) return;

    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <div
      role="switch"
      aria-checked={isChecked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className={cn(
        'w-11 h-6 p-0.5 rounded-full transition-all duration-300 ease-in-out',
        disabled
          ? 'bg-[#bbbbbf] cursor-not-allowed'
          : ['cursor-pointer', isChecked ? 'bg-[#0061ff]' : 'bg-gray-300'],
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out',
          isChecked ? 'translate-x-5' : 'translate-x-0',
          disabled && 'opacity-90'
        )}
      />
    </div>
  );
};
