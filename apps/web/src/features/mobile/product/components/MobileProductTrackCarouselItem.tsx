import { checkIsPureEnglish } from "@/common/utils";
import { cn } from "@/common/utils/tailwind";
import Image from "next/image";
import { ProductRowByDashboardResponse, PlaylistAutoRequest } from "@hitbeatclub/shared-types";
import { usePlayTrack } from "@/hooks/use-play-track";
import { useAudioStore } from "@/stores/audio";
import { usePlaylist } from "@/hooks/use-playlist";
import { useCallback, useMemo } from "react";
import { MobilePlayCircleSVG } from "@/features/mobile/components";
import { AudioBarPause, AudioBarPlay } from "@/assets/svgs";
import { useShallow } from "zustand/react/shallow";

interface MobileProductTrackCarouselItemProps {
	track: ProductRowByDashboardResponse;
	autoPlaylistConfig?: PlaylistAutoRequest;
	trackIndex?: number;
}
export const MobileProductTrackCarouselItem = ({
	track,
	autoPlaylistConfig,
	trackIndex = 0,
}: MobileProductTrackCarouselItemProps) => {
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

	const { createAutoPlaylistAndPlay } = usePlaylist();

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

	const onPlayHandler = useCallback(async () => {
		const isCurrentTrack = currentProductId === track.id;

		console.log(
			`[MobileProductTrackCarouselItem] Play handler called for track ${track.id}, current: ${currentProductId}, isCurrentTrack: ${isCurrentTrack}`,
		);

		// 현재 재생 중인 트랙을 다시 클릭한 경우 → 토글만 수행
		if (isCurrentTrack) {
			console.log(`[MobileProductTrackCarouselItem] Toggling current track ${track.id}`);
			play(track.id); // 내부에서 togglePlay 실행
			return;
		}

		// 자동 플레이리스트 설정이 있는 경우
		if (autoPlaylistConfig) {
			try {
				console.log(
					`[MobileProductTrackCarouselItem] Creating auto playlist for track ${track.id} at index ${trackIndex}`,
				);
				await createAutoPlaylistAndPlay(autoPlaylistConfig, trackIndex);
				console.log(`[MobileProductTrackCarouselItem] Auto playlist created and playing`);
				// 플레이리스트 생성 단계에서 이미 재생이 시작되므로 중복 토글을 방지하기 위해 추가 호출을 제거합니다.
				return;
			} catch (e) {
				console.error("auto playlist failed", e);
				// 자동 플레이리스트 생성 실패 시 단일 트랙 재생으로 폴백
			}
		}

		// 단일 트랙 재생 (플레이리스트 상태는 공통 로직에 위임)
		console.log(`[MobileProductTrackCarouselItem] Playing single track ${track.id}`);
		play(track.id);
	}, [autoPlaylistConfig, trackIndex, createAutoPlaylistAndPlay, play, track.id, currentProductId]);

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
