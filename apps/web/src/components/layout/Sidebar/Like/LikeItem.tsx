import LikeItemImage from "./LikeItemImage";
import { ProductRowByDashboardResponse } from "@hitbeatclub/shared-types";
import Link from "next/link";
import { usePlayTrack } from "@/hooks/use-play-track";
import { useAudioStore } from "@/stores/audio";
import { useShallow } from "zustand/react/shallow";
import { SmallEqualizer } from "@/assets/svgs";
import { usePlaylist } from "@/hooks/use-playlist";
import { createPlaylistConfig } from "@/components/layout/PlaylistProvider";

export interface LikeItemProps {
	track: ProductRowByDashboardResponse;
	/** 리스트 내 트랙의 인덱스 */
	index: number;
	/** 정렬 기준 - Sidebar 에서는 sort 만 필요 */
	sort: "RECENT" | "NAME";
}

export const LikeItem = ({ track, index, sort }: LikeItemProps) => {
	// Hook to trigger playback
	const { play } = usePlayTrack();
	const { createAutoPlaylistAndPlay } = usePlaylist();
	const playlistConfig = createPlaylistConfig.liked({ sort });

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

	/**
	 * 클릭 핸들러
	 * 1. 현재 컨텍스트(좋아요, 정렬 기준) 기반 자동 플레이리스트를 생성 후 인덱스 위치에서 재생
	 * 2. 공통 play 로직을 호출하여 플레이어/사이드바 상태를 동기화
	 */
	const handleClick = async () => {
		try {
			await createAutoPlaylistAndPlay(playlistConfig, index);
			play(track.id);
		} catch (error) {
			// 실패 시 기본 재생 로직으로 폴백
			console.error("[LikeItem] createAutoPlaylistAndPlay failed", error);
			play(track.id);
		}
	};

	return (
		<div
			className="flex items-center justify-start gap-16px w-52px h-52px @200px/sidebar:w-280px @200px/sidebar:h-42px rounded-5px @200px/sidebar:hover:bg-hbc-gray"
			role="button"
			tabIndex={0}
		>
			<div
				className="flex-shrink-0 w-52px @200px/sidebar:w-40px cursor-pointer"
				onClick={handleClick}
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
