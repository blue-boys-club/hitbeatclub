"use client";

import { useState } from "react";
import { cn } from "@/common/utils";
import { cva, type VariantProps } from "class-variance-authority";

const mobileFilterButtonVariants = cva(
	"transition-colors cursor-pointer px-3 py-5px text-xs border-[1px] border-white rounded-20px",
	{
		variants: {
			isSelected: {
				true: "bg-white text-black",
				false: "bg-[#565455] text-white",
			},
		},
		defaultVariants: {
			isSelected: false,
		},
	},
);

interface MobileFilterButtonProps
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">,
		VariantProps<typeof mobileFilterButtonVariants> {
	children: React.ReactNode;
	onFilterChange?: () => void;
}

export const MobileFilterButton = ({ className, children, onFilterChange, ...props }: MobileFilterButtonProps) => {
	const [isSelected, setIsSelected] = useState(false);

	const handleClick = () => {
		setIsSelected((prev) => !prev);
		onFilterChange?.();
	};

	return (
		<button
			{...props}
			onClick={handleClick}
			className={cn(mobileFilterButtonVariants({ isSelected }), className)}
		>
			{children}
		</button>
	);
};
