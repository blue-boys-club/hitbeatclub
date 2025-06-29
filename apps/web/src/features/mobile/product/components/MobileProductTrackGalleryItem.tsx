import { checkIsPureEnglish } from "@/common/utils";
import { cn } from "@/common/utils/tailwind";
import Image from "next/image";
import { ProductRowByDashboardResponse } from "@hitbeatclub/shared-types";
import { usePlayTrack } from "@/hooks/use-play-track";
import { useAudioStore } from "@/stores/audio";
import { usePlaylistStore } from "@/stores/playlist";
import { useShallow } from "zustand/react/shallow";
import { useCallback, useMemo } from "react";
import { MobilePlayCircleSVG, MobilePauseCircleSVG } from "@/features/mobile/components";

interface MobileProductTrackGalleryItemProps {
	track: ProductRowByDashboardResponse;
}
export const MobileProductTrackGalleryItem = ({ track }: MobileProductTrackGalleryItemProps) => {
	const isTitlePureEnglish = checkIsPureEnglish(track.productName);
	const isArtistPureEnglish = checkIsPureEnglish(track.seller?.stageName || "");

	const { play } = usePlayTrack();
	const { status, currentProductId } = useAudioStore(
		useShallow((state) => ({
			status: state.status,
			currentProductId: state.productId,
		})),
	);

	const { setPlaylist } = usePlaylistStore(
		useShallow((state) => ({
			setPlaylist: state.setPlaylist,
		})),
	);

	const statusIcon = useMemo(() => {
		if (currentProductId !== track.id) {
			return <MobilePlayCircleSVG />;
		}

		switch (status) {
			case "playing":
				return <MobilePauseCircleSVG />;
			case "paused":
				return <MobilePlayCircleSVG />;
			default:
				return <MobilePlayCircleSVG />;
		}
	}, [status, currentProductId, track.id]);

	const onPlayHandler = useCallback(() => {
		// 플레이리스트를 초기화하고 클릭한 곡만 추가
		setPlaylist([{
			id: track.id,
			productName: track.productName,
			coverImage: track.coverImage,
			seller: track.seller,
		}]);
		
		// 곡 재생
		play(track.id);
	}, [play, track.id, track.productName, track.coverImage, track.seller, setPlaylist]);

	return (
		<div
			className="inline-flex flex-col items-start justify-start gap-6px w-full group cursor-pointer"
			onClick={onPlayHandler}
		>
			<div className="border-y-3px border-x-1px border-black relative w-full aspect-square">
				<Image
					alt="커버이미지"
					src={track.coverImage?.url || ""}
					fill
					className="object-cover"
				/>
				<div
					className={cn(
						"absolute inset-0 flex items-center justify-center transition-opacity duration-200 bg-black/30",
						currentProductId === track.id ? "opacity-100" : "opacity-0 group-hover:opacity-100",
					)}
				>
					<div className="flex items-center justify-center">
						{statusIcon}
					</div>
				</div>
			</div>
			<div className="flex flex-col items-start justify-start gap-3px w-full">
				<div className="flex items-center w-full">
					<div
						className={cn(
							"text-hbc-black text-12px font-semibold leading-16px truncate max-w-full",
							isTitlePureEnglish ? "font-suisse" : "font-suit",
						)}
					>
						{track.productName}
					</div>
					{/* {isHit && <Hit />} */}
				</div>
				<div
					className={cn("text-10px font-normal leading-10px w-full", isArtistPureEnglish ? "font-suisse" : "font-suit")}
				>
					<span className="text-hbc-gray-300 truncate block">{track.seller?.stageName}</span>
				</div>
			</div>
		</div>
	);
};
