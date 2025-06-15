import { cn } from "@/common/utils";
import { CloseWhite } from "@/assets/svgs";

export interface Tag {
	id: number;
	text: string;
	isFromDropdown?: boolean;
}

export interface TagItemProps {
	tag: Tag;
	onClickClose: () => void;
	tagColor: string;
	tagTextColor: string;
}

export const TagItem = ({ tag, onClickClose, tagColor, tagTextColor }: TagItemProps) => {
	return (
		<div
			className={cn(
				"flex justify-center items-center gap-4 pl-[8px] py-[2px] pr-[3px] border-2 border-black rounded-[40px]",
				tagColor,
			)}
		>
			<span className={cn("whitespace-nowrap text-xs font-bold leading-4", tagTextColor)}>#{tag.text}</span>
			<div
				onClick={onClickClose}
				className="cursor-pointer"
			>
				<CloseWhite
					width="12px"
					height="12px"
					backgroundColor={tagColor.includes("white") ? "black" : "white"}
					fillColor={tagColor.includes("white") ? "white" : "black"}
				/>
			</div>
		</div>
	);
};
