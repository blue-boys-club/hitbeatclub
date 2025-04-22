"use client";

import { memo, useState } from "react";
import { CloseWhite } from "@/assets/svgs/CloseWhite";
import { cn } from "@/common/utils";

interface TagButtonProps {
	name: string;
	className?: string;
	onSelect?: () => void;
	isClickable?: boolean;
}

export const TagButton = memo(({ name, className, onSelect, isClickable = true }: TagButtonProps) => {
	const [isSelected, setIsSelected] = useState(false);

	const onSelectTag = () => {
		if (!isClickable) return;

		setIsSelected(!isSelected);
		onSelect?.();
	};

	return (
		<div
			onClick={onSelectTag}
			className={cn(
				"h-[20px] px-2 rounded-[44.63px] outline-2 outline-offset-[-1px] outline-black inline-flex justify-between items-center gap-2 transition-colors",
				isSelected ? "bg-black" : "bg-white",
				isClickable && "cursor-pointer",
				className,
			)}
		>
			<div className={cn("text-sm font-medium leading-none", isSelected ? "text-white" : "text-black")}>#{name}</div>

			{isSelected && <CloseWhite />}
		</div>
	);
});

TagButton.displayName = "TagButton";
