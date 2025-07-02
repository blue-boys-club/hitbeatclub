"use client";

import { memo } from "react";
import { checkIsPureEnglish, cn } from "@/common/utils";
import { CloseBlack } from "@/assets/svgs/CloseBlack";

interface GenreButtonProps {
	name: string;
	showDeleteButton?: boolean;
	readOnly?: boolean;
	onDelete?: () => void;
	className?: string;
}

export const GenreButton = memo(
	({ showDeleteButton = false, name, onDelete, className, readOnly = false }: GenreButtonProps) => {
		const handleClick = () => {
			onDelete?.();
		};

		return (
			<div
				onClick={handleClick}
				className={cn(
					"cursor-pointer h-[22px] px-2 py-0.5 bg-white rounded-[40px] outline-2 outline-offset-[-1px] outline-black inline-flex justify-center items-center transition-colors gap-1.5",
					!showDeleteButton && "hover:bg-black group",
					readOnly && "cursor-default hover:bg-white",
					className,
				)}
			>
				<div
					className={cn(
						"text-xs font-semibold leading-none tracking-tight transition-colors",
						showDeleteButton ? "text-black" : "text-black group-hover:text-white",
						readOnly && "text-black group-hover:text-black",
						checkIsPureEnglish(name) && "font-suisse",
					)}
				>
					{name}
				</div>

				{showDeleteButton && <CloseBlack />}
			</div>
		);
	},
);

GenreButton.displayName = "GenreButton";
