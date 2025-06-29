import LikeItemImage from "./LikeItemImage";
import { SmallEqualizer } from "@/assets/svgs";
import { useRouter } from "next/navigation";
import { ProductRowByDashboardResponse } from "@hitbeatclub/shared-types";
import Link from "next/link";

export interface LikeItemProps {
	track: ProductRowByDashboardResponse;
}

export const LikeItem = ({ track }: LikeItemProps) => {
	return (
		<div className="flex items-center justify-start gap-16px w-52px h-52px @200px/sidebar:w-280px @200px/sidebar:h-42px rounded-5px @200px/sidebar:hover:bg-hbc-gray">
			<div className="flex-shrink-0 w-52px @200px/sidebar:w-40px">
				<LikeItemImage
					// TODO: Implement proper status
					// status={track.id === 0 ? "playing" : track.id === 1 ? "paused" : "default"}
					status="default"
					imageUrl={track.coverImage?.url || "https://placehold.co/60x60.png"}
					alt={track.productName}
				/>
			</div>
			<div className="flex flex-row w-full h-full gap-3px">
				<div className="hidden @200px/sidebar:flex flex-col items-start justify-center h-full font-suit text-16px text-hbc-black leading-100% max-w-200px">
					<Link
						className="w-full font-bold truncate cursor-pointer hover:underline"
						href={`/products/${track.id}`}
					>
						{track.productName}
					</Link>
					<Link
						className="w-full font-normal truncate hover:underline"
						href={`/artists/${track.seller.slug}`}
					>
						{track.seller.stageName}
					</Link>
				</div>
				{/* TODO: remove this and connect to the audio player */}
				{/* {track.productId % 3 === 0 && (
					<div className="flex @200px/sidebar:items-start items-center justify-center h-full py-4px ">
						<SmallEqualizer />
					</div>
				)} */}
			</div>
		</div>
	);
};

export default LikeItem;
