import LikeItemImage from "./LikeItemImage";
import { ProductRowByDashboardResponse } from "@hitbeatclub/shared-types";
import Link from "next/link";
import { usePlayTrack } from "@/hooks/use-play-track";
import { useAudioStore } from "@/stores/audio";
import { useShallow } from "zustand/react/shallow";
import { SmallEqualizer } from "@/assets/svgs";

export interface LikeItemProps {
	track: ProductRowByDashboardResponse;
}

export const LikeItem = ({ track }: LikeItemProps) => {
	// Hook to trigger playback
	const { play } = usePlayTrack();

	// Get current audio status to decide overlay state
	const { status, productId: currentProductId } = useAudioStore(
		useShallow((state) => ({
			status: state.status,
			productId: state.productId,
		})),
	);

	// Determine this item's effective status
	const effectiveStatus: "playing" | "paused" | "default" = (() => {
		if (currentProductId !== track.id) return "default";
		if (status === "playing" || status === "paused") return status;
		return "default";
	})();

	return (
		<div
			className="flex items-center justify-start gap-16px w-52px h-52px @200px/sidebar:w-280px @200px/sidebar:h-42px rounded-5px @200px/sidebar:hover:bg-hbc-gray"
			role="button"
			tabIndex={0}
		>
			<div
				className="flex-shrink-0 w-52px @200px/sidebar:w-40px cursor-pointer"
				onClick={() => play(track.id)}
			>
				<LikeItemImage
					status={effectiveStatus}
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
				{effectiveStatus === "playing" && (
					<div className="flex @200px/sidebar:items-start items-center justify-center h-full py-4px">
						<SmallEqualizer />
					</div>
				)}
			</div>
		</div>
	);
};

export default LikeItem;
