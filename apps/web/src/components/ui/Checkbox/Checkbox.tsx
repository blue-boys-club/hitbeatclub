"use client";

import { cn } from "@/common/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, memo } from "react";

const checkboxVariants = cva("inline-flex items-center justify-center cursor-pointer transition-all duration-200", {
	variants: {
		size: {
			default: "w-3 h-3",
			small: "w-2 h-2",
		},
		rounded: {
			default: "rounded-[2px]",
		},
	},
	defaultVariants: {
		size: "default",
		rounded: "default",
	},
});

export interface CheckboxProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
		VariantProps<typeof checkboxVariants> {
	className?: string;
	wrapperClassName?: string;
}

export const Checkbox = memo(
	forwardRef<HTMLInputElement, CheckboxProps>(({ className, wrapperClassName, size, rounded, ...props }, ref) => {
		const iconSize = size === "small" ? "w-2 h-2" : "w-3 h-3";

		return (
			<div className={cn("relative inline-block", wrapperClassName)}>
				<input
					type="checkbox"
					ref={ref}
					className={cn(
						checkboxVariants({ size, rounded }),
						"bg-[#CFCECE] border-none appearance-none peer block",
						"checked:bg-[#CFCECE] focus:ring-0 focus:ring-offset-0",
						className,
					)}
					{...props}
				/>
				<svg
					className={cn(
						"absolute top-0 left-0 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity",
						iconSize,
					)}
					viewBox="0 0 12 12"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M2.5 6L5 8.5L9.5 3.5"
						stroke="black"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</div>
		);
	}),
);

Checkbox.displayName = "Checkbox";
