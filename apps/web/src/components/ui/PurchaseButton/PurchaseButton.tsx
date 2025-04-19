import { PlusCircle } from "@/assets/svgs/PlusCircle";
import { cn } from "@/common/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React, { memo } from "react";

export interface PurchaseButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof purchaseButtonVariants> {
	children: React.ReactNode;
	iconColor: string;
}

const purchaseButtonVariants = cva(
	cn(
		"font-bold leading-normal transition-colors duration-200",
		"rounded-full border-2 border-black cursor-pointer",
		"flex items-center justify-center gap-[7px]",
	),
	{
		variants: {
			variant: {
				primary: "bg-[#3884FF] text-white hover:bg-[#3884FF]/80",
				secondary: "bg-white text-black hover:bg-gray-100",
			},
			size: {
				small: "px-4 py-1 text-base ",
				medium: "px-6 py-2 text-lg ",
				large: "px-8 py-3 text-xl ",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "small",
		},
	},
);

export const PurchaseButton = memo(
	({ variant, size, className, children, iconColor, ...props }: PurchaseButtonProps) => {
		return (
			<button
				className={cn(purchaseButtonVariants({ variant, size }), className)}
				{...props}
			>
				<PlusCircle color={iconColor} />
				{children}
			</button>
		);
	},
);

PurchaseButton.displayName = "PurchaseButton";
