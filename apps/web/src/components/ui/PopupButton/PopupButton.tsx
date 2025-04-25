import { cn } from "@/common/utils";
import { cva, VariantProps } from "class-variance-authority";
import React, { forwardRef } from "react";

export interface PopupButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof popupButtonVariants> {}

const popupButtonVariants = cva(
	cn(
		"px-[10px] py-[5px] rounded-[30px] ",
		"text-[18px] text-white text-center font-extrabold ",
		"leading-[18px] tracking-[0.18px] cursor-pointer",
	),
	{
		variants: {
			intent: {
				confirm: "bg-black ",
				cancel: "bg-red-500 ",
			},
		},
		defaultVariants: {
			intent: "confirm",
		},
	},
);

export const PopupButton = forwardRef<HTMLButtonElement, PopupButtonProps>(
	({ className, intent, children, ...props }, ref) => {
		return (
			<button
				ref={ref}
				className={cn(popupButtonVariants({ intent, className }))}
				{...props}
			>
				{children}
			</button>
		);
	},
);

PopupButton.displayName = "PopupButton";
