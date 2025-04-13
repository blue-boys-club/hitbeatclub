"use client";

import { memo } from "react";
import { cn } from "@/common/utils";
import { CloseBlack } from "@/assets/svgs/CloseBlack";

interface GenreButtonProps {
	genreName: string;
	showDeleteButton?: boolean;
	onDelete?: () => void;
	className?: string;
}

export const GenreButton = memo(({ showDeleteButton = false, genreName, onDelete, className }: GenreButtonProps) => {
	const handleClick = () => {
		onDelete?.();
	};

	return (
		<div
			onClick={handleClick}
			className={cn(
				"cursor-pointer h-[22px] px-2 py-0.5 bg-white rounded-[40px] outline-2 outline-offset-[-1px] outline-black inline-flex justify-center items-center transition-colors gap-1.5",
				!showDeleteButton && "hover:bg-black group",
				className,
			)}
		>
			<div
				className={cn(
					"text-xs font-semibold leading-none tracking-tight transition-colors",
					showDeleteButton ? "text-black" : "text-black group-hover:text-white",
				)}
			>
				{genreName}
			</div>

			{showDeleteButton && <CloseBlack />}
		</div>
	);
});

GenreButton.displayName = "GenreButton";
