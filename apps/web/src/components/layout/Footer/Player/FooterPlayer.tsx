"use client";

import { useEffect, useState } from "react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Like, ShoppingBag } from "@/assets/svgs";
import { AudioPlayer } from "./AudioPlayer";
import { VolumeControl } from "./VolumeControl";
import Image from "next/image";
import { assetImageLoader } from "@/common/utils/image-loader";
import { useLikeProductMutation, useUnlikeProductMutation } from "@/apis/product/mutations";
import { useShallow } from "zustand/react/shallow";
import { useAudioStore } from "@/stores/audio";
import { PurchaseWithCartTrigger } from "@/features/product/components/PurchaseWithCartTrigger";
import { DropContentWrapper } from "@/features/dnd/components/DropContentWrapper";
import { useToast } from "@/hooks/use-toast";
import { ENUM_FILE_TYPE } from "@hitbeatclub/shared-types/file";
import { useQuery } from "@tanstack/react-query";
import { getPlayerListQueryOptions } from "@/apis/player/query/player.query-options";
import { getProductFileDownloadLinkQueryOption } from "@/apis/product/query/product.query-option";

/**
 * 푸터 플레이어 컴포넌트
 * - 오디오 파일 다운로드 링크를 가져와서 재생
 * - 재생 실패시 토스트 메시지 표시
 * - 플레이어 리스트를 활용한 다음 트랙 재생 기능
 */
export const FooterPlayer = () => {
	const { id, productName, seller, isLiked, audioFile, coverImage, updateIsLiked } = useAudioStore(
		useShallow((state) => ({
			id: state.id,
			productName: state.productName,
			seller: state.seller,
			isLiked: state.isLiked,
			audioFile: state.audioFile,
			coverImage: state.coverImage,
			updateIsLiked: state.updateIsLiked,
		})),
	);

	// Audio player state and controls
	const audioPlayerState = useAudioPlayer();
	const { toast } = useToast();

	const { mutate: likeMutation } = useLikeProductMutation();
	const { mutate: unlikeProduct } = useUnlikeProductMutation();

	// Get player list for next track functionality
	const { data: playerList } = useQuery(
		getPlayerListQueryOptions({
			page: 1,
			limit: 100,
		}),
	);

	// State to store current audio URL
	const [currentAudioUrl, setCurrentAudioUrl] = useState<string>("");

	// 다음 트랙 찾기 및 재생 (플레이어 리스트 활용)
	const playNextTrack = () => {
		if (!playerList || !Array.isArray(playerList) || !id) return;

		const currentIndex = playerList.findIndex((item: any) => item.productId === id);
		if (currentIndex === -1) return;

		const nextIndex = (currentIndex + 1) % playerList.length;
		const nextTrack = playerList[nextIndex];

		if (nextTrack) {
			playAudioFile(nextTrack.productId);
		}
	};

	const onClickLike = () => {
		if (!id) return;

		if (!isLiked) {
			likeMutation(id, {
				onSuccess: () => {
					updateIsLiked(true);
				},
			});
		} else {
			unlikeProduct(id, {
				onSuccess: () => {
					updateIsLiked(false);
				},
			});
		}
	};

	// 오디오 파일 다운로드 링크 조회를 위한 상태
	const [audioProductId, setAudioProductId] = useState<number | null>(null);

	// 오디오 파일 다운로드 링크 조회
	const { data: audioFileDownloadLink, error: audioFileError } = useQuery({
		...getProductFileDownloadLinkQueryOption(audioProductId!, ENUM_FILE_TYPE.PRODUCT_AUDIO_FILE),
		enabled: !!audioProductId,
	});

	// 오디오 파일 다운로드 링크가 변경될 때마다 재생
	useEffect(() => {
		if (audioFileDownloadLink?.url) {
			setCurrentAudioUrl(audioFileDownloadLink.url);
			audioPlayerState.stop();
			const timer = setTimeout(() => {
				audioPlayerState.autoPlay();
			}, 200);
			return () => clearTimeout(timer);
		}
	}, [audioFileDownloadLink]);

	// 오디오 파일 다운로드 에러 처리
	useEffect(() => {
		if (audioFileError) {
			toast({
				title: "재생 실패",
				description: "오디오 파일을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.",
				variant: "destructive",
			});
		}
	}, [audioFileError, toast]);

	// 오디오 파일 다운로드 링크 가져오기 및 재생
	const playAudioFile = (productId: number) => {
		if (!productId) return;
		setAudioProductId(productId);
	};

	// ID가 변경될 때마다 오디오 파일 다운로드 링크 가져오기
	useEffect(() => {
		if (id) {
			playAudioFile(id);
		}
	}, [id]);

	return (
		<DropContentWrapper
			id={"player"}
			asChild
		>
			<div className="w-full h-20 bg-white border-t-8 border-black">
				<div className="flex items-center justify-between w-full p-2">
					{/* 트랙 정보 및 좋아요/장바구니 */}
					<div className="flex items-center gap-2 w-96">
						<div className="flex items-center justify-between gap-4">
							{coverImage?.url ? (
								<Image
									width={60}
									height={60}
									alt="track-image"
									className="border-black w-14 h-14"
									src={coverImage.url}
									loader={assetImageLoader}
								/>
							) : (
								<div className="w-14 h-14 bg-gray-200 border border-black flex items-center justify-center">
									<span className="text-xs text-gray-500">No Image</span>
								</div>
							)}
							<div className="flex flex-col gap-1">
								<div className="text-xl font-bold leading-none text-black">{productName}</div>
								<div className="text-base font-bold leading-none w-36 text-black/70">{seller?.stageName}</div>
							</div>
						</div>

						<div className="flex justify-between items-center gap-[10px]">
							<div
								className="flex items-center justify-center w-8 h-8 cursor-pointer"
								onClick={onClickLike}
							>
								{isLiked ? (
									<Image
										width={20}
										height={20}
										className="w-5 h-5"
										src="/assets/ActiveLike.png"
										alt="like"
									/>
								) : (
									<Like />
								)}
							</div>

							<PurchaseWithCartTrigger productId={id ?? 0}>
								{({ isOnCart }) => <ShoppingBag color={isOnCart ? "#3884FF" : "white"} />}
							</PurchaseWithCartTrigger>
						</div>
					</div>

					{/* 재생 컨트롤 */}
					<div className="flex justify-center flex-1 ">
						<AudioPlayer
							{...audioPlayerState}
							url={currentAudioUrl || audioFile?.url || ""}
						/>
					</div>

					{/* 볼륨 컨트롤 */}
					<div className="flex justify-end w-96">
						<VolumeControl {...audioPlayerState} />
					</div>
				</div>
			</div>
		</DropContentWrapper>
	);
};
