import { cn } from "@/common/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React, { memo } from "react";

export interface FreeDownloadButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof freeDownLoadButtonVariants> {
  children: React.ReactNode;
}

const freeDownLoadButtonVariants = cva(
  cn(
    "font-bold leading-normal transition-colors duration-200",
    "rounded-full border-2 border-black cursor-pointer"
  ),
  {
    variants: {
      variant: {
        primary: "bg-[#3884FF] text-white hover:bg-[#3884FF]/80",
        secondary: "bg-white text-black hover:bg-gray-100",
      },
      size: {
        small: "px-4 py-1 text-base",
        medium: "px-6 py-2 text-lg",
        large: "px-8 py-3 text-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "small",
    },
  }
);

export const FreeDownloadButton = memo(
  ({
    variant,
    size,
    className,
    children,
    ...props
  }: FreeDownloadButtonProps) => {
    return (
      <button
        className={cn(freeDownLoadButtonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

FreeDownloadButton.displayName = "FreeDownloadButton";
