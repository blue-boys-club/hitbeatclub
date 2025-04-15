import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/common/utils";

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof BadgeVariant> {
  children: React.ReactNode;
}

const BadgeVariant = cva(
  "flex items-center justify-center w-fit leading-none",
  {
    variants: {
      variant: {
        default: "bg-black text-white",
        destructive: "bg-[#FF1900] text-white",
        secondary: "bg-[#DFDFDF] text-black",
        outline: "bg-white text-black",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-base px-[10px] py-1",
        lg: "text-lg px-4 py-1.5",
      },
      bold: {
        semibold: "font-semibold",
        bold: "font-bold",
        extrabold: "font-extrabold",
      },
      outline: {
        true: "border-black border-[4px]",
        false: "",
      },
      rounded: {
        true: "rounded-[40px]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      bold: "bold",
      outline: false,
      rounded: false,
    },
  }
);

export const Badge = ({
  variant,
  size,
  bold,
  outline,
  rounded,
  children,
  className,
  ...props
}: BadgeProps) => {
  return (
    <span
      className={cn(
        BadgeVariant({ variant, size, bold, outline, rounded }),
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
