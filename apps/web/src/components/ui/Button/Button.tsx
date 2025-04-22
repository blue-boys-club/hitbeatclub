"use client";

import { cn } from "@/common/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
	cn(
		"inline-flex items-center justify-center transition-colors cursor-pointer",
		"disabled:opacity-50 disabled:pointer-events-none",
	),
	{
		variants: {
			variant: {
				fill: "bg-black text-white hover:bg-gray-800",
				outline: "bg-white text-black border-2 border-black hover:bg-gray-100",
			},
			size: {
				sm: "h-7 px-3 py-2 text-sm",
				md: "h-8 px-4 py-2 text-base",
				lg: "h-9 px-6 py-2 text-lg",
			},
			rounded: {
				md: "rounded-md",
				full: "rounded-full",
			},
			fontWeight: {
				extraBold: "font-extrabold",
				bold: "font-bold",
				semibold: "font-semibold",
			},
		},
		defaultVariants: {
			variant: "fill",
			size: "md",
			rounded: "md",
			fontWeight: "bold",
		},
	},
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
	children: React.ReactNode;
	onClick?: () => void;
	disabled?: boolean;
}

export const Button = ({ fontWeight, rounded, size, variant, className, disabled, ...props }: ButtonProps) => {
	return (
		<button
			{...props}
			className={cn(buttonVariants({ variant, size, rounded, fontWeight }), className)}
			disabled={disabled}
		>
			{props.children}
		</button>
	);
};
