import { cn } from "@/common/utils";
import { CloseWhite } from "@/assets/svgs";

export interface Genre {
	id: number;
	text: string;
	isFromDropdown?: boolean;
}

export interface GenreItemProps {
	genre: Genre;
	onClickClose: () => void;
	genreColor: string;
	genreTextColor: string;
}

export const GenreItem = ({ genre, onClickClose, genreColor, genreTextColor }: GenreItemProps) => {
	return (
		<div
			className={cn(
				"flex justify-center items-center gap-4 pl-[8px] py-[2px] pr-[3px] border-2 border-black rounded-[40px]",
				genreColor,
			)}
		>
			<span className={cn("whitespace-nowrap text-xs font-bold leading-4", genreTextColor)}>#{genre.text}</span>
			<div
				onClick={onClickClose}
				className="cursor-pointer"
			>
				<CloseWhite
					width="12px"
					height="12px"
					backgroundColor={genreColor.includes("white") ? "black" : "white"}
					fillColor={genreColor.includes("white") ? "white" : "black"}
				/>
			</div>
		</div>
	);
};
