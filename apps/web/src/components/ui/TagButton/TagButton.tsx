"use client";

import { memo, useState } from "react";
import { CloseWhite } from "@/assets/svgs/CloseWhite";
import { cn } from "@/common/utils";

interface TagButtonProps {
	tagName: string;
	className?: string;
	onClick?: () => void;
}

export const TagButton = memo(({ tagName, className, onClick }: TagButtonProps) => {
	const [isSelected, setIsSelected] = useState(false);

	const handleClick = () => {
		setIsSelected((prev) => !prev);
		onClick?.();
	};

	return (
		<div
			onClick={handleClick}
			className={cn(
				"h-[20px] px-2 rounded-[44.63px] outline-2 outline-offset-[-1px] outline-black inline-flex justify-between items-center gap-2 cursor-pointer transition-colors",
				isSelected ? "bg-black" : "bg-white",
				className,
			)}
		>
			<div className={cn("text-sm font-medium leading-none", isSelected ? "text-white" : "text-black")}>#{tagName}</div>

			{isSelected && <CloseWhite />}
		</div>
	);
});

TagButton.displayName = "TagButton";
