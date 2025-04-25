import { memo } from "react";
import { CloseWhite } from "@/assets/svgs/CloseWhite";
import { cn } from "@/common/utils";

interface TagButtonProps {
	name: string;
	className?: string;
	onClick?: () => void;
	isActive?: boolean;
}

export const SearchTagButton = memo(({ name, className, onClick, isActive = false }: TagButtonProps) => {
	return (
		<div
			onClick={onClick}
			className={cn(
				"h-24px px-2 rounded-[44.63px] outline-2 outline-offset-[-1px] outline-black inline-flex justify-between items-center gap-2 transition-colors cursor-pointer",
				isActive ? "bg-black" : "bg-white",
				className,
			)}
		>
			<div className={cn("text-16px font-suisse font-medium leading-none", isActive ? "text-white" : "text-black")}>
				#{name}
			</div>

			{isActive && <CloseWhite />}
		</div>
	);
});

SearchTagButton.displayName = "SearchTagButton";
