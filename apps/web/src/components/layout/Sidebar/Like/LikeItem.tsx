import { ProductItem } from "../types";
import LikeItemImage from "./LikeItemImage";
import { SmallEqualizer } from "@/assets/svgs";

export interface LikeItemProps {
	track: ProductItem;
}

export const LikeItem = ({ track }: LikeItemProps) => {
	return (
		<div className="flex items-center justify-start gap-16px w-52px h-52px @200px/sidebar:w-280px @200px/sidebar:h-42px rounded-5px @200px/sidebar:hover:bg-hbc-gray">
			<div className="flex-shrink-0 w-52px @200px/sidebar:w-40px">
				<LikeItemImage
					// TODO: Implement proper status
					status={track.id === 0 ? "playing" : track.id === 1 ? "paused" : "default"}
					imageUrl={track.imageUrl}
					alt={track.title}
				/>
			</div>
			<div className="flex flex-row w-full h-full gap-3px">
				<div className="hidden @200px/sidebar:flex flex-col items-start justify-center h-full font-suit text-16px text-hbc-black leading-100% max-w-200px">
					<div className="w-full font-bold truncate">{track.title}</div>
					<div className="w-full font-normal truncate">{track.artist}</div>
				</div>
				{/* TODO: remove this and connect to the audio player */}
				{track.id % 3 === 0 && (
					<div className="flex @200px/sidebar:items-start items-center justify-center h-full py-4px ">
						<SmallEqualizer />
					</div>
				)}
			</div>
		</div>
	);
};

export default LikeItem;
