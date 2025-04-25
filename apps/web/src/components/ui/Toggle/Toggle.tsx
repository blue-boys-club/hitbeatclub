"use client";

import { cn } from "@/common/utils";
import { forwardRef, useId } from "react";

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
	className?: string;
	toggleClassName?: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
	({ className, toggleClassName, disabled, ...props }, ref) => {
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
					className={cn(
						"w-11 h-6 p-0.5 rounded-full flex items-center transition-all duration-300 ease-in-out",
						"after:content-[''] after:absolute after:h-5 after:w-5 after:bg-white after:rounded-full after:shadow-sm after:transition-transform after:duration-300 after:ease-in-out",
						"peer-checked:after:translate-x-full after:translate-x-0",
						"bg-gray-300 peer-checked:bg-[#0061ff]",
						"peer-disabled:bg-[#bbbbbf] peer-disabled:cursor-not-allowed peer-disabled:after:opacity-90",
						"cursor-pointer",
						toggleClassName,
					)}
				/>
			</div>
		);
	},
);

Toggle.displayName = "Toggle";
