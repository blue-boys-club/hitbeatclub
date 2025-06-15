"use client";

import { cn } from "@/common/utils";
import { cva } from "class-variance-authority";
import { forwardRef, useId } from "react";

const toggleVariants = cva(
	"p-0.5 rounded-full flex items-center transition-all duration-300 ease-in-out cursor-pointer after:content-[''] after:absolute after:bg-white after:rounded-full after:shadow-sm after:transition-transform after:duration-300 after:ease-in-out after:translate-x-0 bg-gray-300 peer-checked:bg-[#0061ff] peer-disabled:bg-[#bbbbbf] peer-disabled:cursor-not-allowed peer-disabled:after:opacity-90",
	{
		variants: {
			mobile: {
				true: "w-8 h-5 after:h-4 after:w-4 peer-checked:after:translate-x-3",
				false: "w-11 h-6 after:h-5 after:w-5 peer-checked:after:translate-x-full",
			},
		},
		defaultVariants: {
			mobile: false,
		},
	},
);

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
	className?: string;
	toggleClassName?: string;
	mobile?: boolean;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
	({ className, toggleClassName, disabled, mobile, ...props }, ref) => {
		const id = useId();

		return (
			<div className={cn("relative inline-flex items-center", className)}>
				<input
					type="checkbox"
					id={id}
					className="sr-only peer"
					disabled={disabled}
					ref={ref}
					{...props}
				/>
				<label
					htmlFor={id}
					className={cn(toggleVariants({ mobile }), toggleClassName)}
				/>
			</div>
		);
	},
);

Toggle.displayName = "Toggle";
