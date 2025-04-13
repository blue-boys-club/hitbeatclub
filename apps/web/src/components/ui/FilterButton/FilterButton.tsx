'use client';

import { useState } from 'react';
import { cn } from '@/common/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const filterButtonVariants = cva(
  'transition-colors cursor-pointer px-3 py-1 text-md font-semibold border-2 border-black outline-4 outline-offset-[-4px] outline-black',
  {
    variants: {
      rounded: {
        none: '',
        full: 'rounded-full',
      },
      isSelected: {
        true: 'bg-black text-white',
        false: 'bg-white text-black hover:bg-gray-100',
      },
    },
    defaultVariants: {
      rounded: 'none',
      isSelected: false,
    },
  }
);

interface FilterButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>,
    VariantProps<typeof filterButtonVariants> {
  children: React.ReactNode;
  onFilterChange?: () => void;
}

export const FilterButton = ({
  rounded,
  className,
  children,
  onFilterChange,
  ...props
}: FilterButtonProps) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected((prev) => !prev);
    onFilterChange?.();
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className={cn(filterButtonVariants({ rounded, isSelected }), className)}
    >
      {children}
    </button>
  );
};
