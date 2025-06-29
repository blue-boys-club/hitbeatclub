"use client";

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
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof mobileFilterButtonVariants> {
	children: React.ReactNode;
	isActive?: boolean;
}

export const MobileFilterButton = ({
	className,
	children,
	isActive = false,
	isSelected,
	...props
}: MobileFilterButtonProps) => {
	// isActive가 제공되면 그것을 사용하고, 그렇지 않으면 isSelected를 사용
	const selected = isActive !== undefined ? isActive : isSelected;

	return (
		<button
			{...props}
			className={cn(mobileFilterButtonVariants({ isSelected: selected }), className)}
		>
			{children}
		</button>
	);
};
