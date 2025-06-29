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
import { AudioBarPause, AudioBarPlay } from "@/assets/svgs";

interface MobileProductTrackCarouselItemProps {
	track: ProductRowByDashboardResponse;
}
export const MobileProductTrackCarouselItem = ({ track }: MobileProductTrackCarouselItemProps) => {
	const { productName, seller, coverImage } = track;
	const isTitlePureEnglish = checkIsPureEnglish(productName);
	const isArtistPureEnglish = checkIsPureEnglish(seller?.stageName || "");

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
				return (
					<AudioBarPause
						width={20}
						height={20}
						fill={"white"}
					/>
				);
			case "paused":
				return (
					<AudioBarPlay
						width={20}
						height={20}
						fill={"white"}
					/>
				);
			default:
				return (
					<AudioBarPlay
						width={20}
						height={20}
						fill={"white"}
					/>
				);
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
			className="inline-flex flex-col items-start justify-start gap-6px group cursor-pointer"
			onClick={onPlayHandler}
		>
			<div className="border-y-3px border-x-1px border-black relative w-110px h-110px">
				<Image
					alt="커버이미지"
					src={coverImage?.url || ""}
					fill
					className="object-cover"
				/>
				<div
					className={cn(
						"absolute inset-0 flex items-center justify-center transition-opacity duration-200 bg-black/30",
						currentProductId === track.id ? "opacity-100" : "opacity-0 group-hover:opacity-100",
					)}
				>
					<div className="flex items-center justify-center">{statusIcon}</div>
				</div>
			</div>
			<div className="flex flex-col items-start justify-start gap-3px">
				<div className="inline-flex items-center justify-center gap-10px">
					<div
						className={cn(
							"w-110px justify-start text-hbc-black text-12px font-semibold leading-16px truncate",
							isTitlePureEnglish ? "font-suisse" : "font-suit",
						)}
					>
						{productName}
					</div>
					{/* {isHit && <Hit />} */}
				</div>
				<div
					className={cn(
						"w-110px justify-start text-10px font-normal leading-10px truncate",
						isArtistPureEnglish ? "font-suisse" : "font-suit",
					)}
				>
					<span className="text-hbc-gray-300">{seller?.stageName}</span>
				</div>
			</div>
		</div>
	);
};
