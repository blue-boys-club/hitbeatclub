import { cn } from "@/common/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React, { forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof InputVariants> {}

const InputVariants = cva(
  cn(
    "w-full p-[5px]",
    "border-black bg-white outline-none",
    "placeholder:text-gray-400",
    "transition-colors duration-200",
    "disabled:opacity-50 disabled:cursor-not-allowed"
  ),
  {
    variants: {
      variant: {
        rounded: "h-9 border-x-[1px] border-y-[2px] rounded-[5px]",
        square: "h-7 border-0 border-b-[1px]",
      },
    },
    defaultVariants: {
      variant: "rounded",
    },
  }
);

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(InputVariants({ variant, className }))}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
