"use client";

import { useEffect, useState, useRef } from "react";
import { useAudioContext, useCurrentTime } from "@/contexts/AudioContext";
import { Like, ShoppingBag } from "@/assets/svgs";
import { AudioPlayer } from "./AudioPlayer";
import { VolumeControl } from "./VolumeControl";
import Image from "next/image";
import { assetImageLoader } from "@/common/utils/image-loader";
import { useLikeProductMutation, useUnlikeProductMutation } from "@/apis/product/mutations";
import { useShallow } from "zustand/react/shallow";
import { useAudioStore } from "@/stores/audio";
import { usePlaylist } from "@/hooks/use-playlist";
import { PurchaseWithCartTrigger } from "@/features/product/components/PurchaseWithCartTrigger";
import { DropContentWrapper } from "@/features/dnd/components/DropContentWrapper";
import { useToast } from "@/hooks/use-toast";
import { ENUM_FILE_TYPE } from "@hitbeatclub/shared-types/file";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductFileDownloadLinkQueryOption } from "@/apis/product/query/product.query-option";
import { getProductQueryOption } from "@/apis/product/query/product.query-option";
import { SidebarType, useLayoutStore } from "@/stores/layout";
import { cn } from "@/common/utils/tailwind";
import Link from "next/link";

/**
 * 푸터 플레이어 컴포넌트
 * - productId 기반으로 서버에서 데이터 조회
 * - 오디오 파일 다운로드 링크를 가져와서 재생
 * - 재생 실패시 토스트 메시지 표시
 * - 플레이리스트를 활용한 이전/다음 트랙 재생 기능
 * - 재생 불가 트랙 자동 건너뛰기
 */
export const FooterPlayer = () => {
	const { productId, isPlaying, setIsPlaying, setProductId, setStatus } = useAudioStore(
		useShallow((state) => ({
			productId: state.productId,
			isPlaying: state.isPlaying,
			setIsPlaying: state.setIsPlaying,
			setProductId: state.setProductId,
			setStatus: state.setStatus,
		})),
	);

	// 플레이리스트 훅 사용
	const {
		trackIds,
		currentIndex,
		currentPlayableTrackId,
		playNextTrack,
		playPreviousTrack,
		handleUnplayableTrack,
		isShuffleEnabled,
		repeatMode,
		toggleShuffle,
		toggleRepeatMode,
	} = usePlaylist();
	const { isOpen, setRightSidebar, setPlayer } = useLayoutStore(
		useShallow((state) => ({
			isOpen: state.rightSidebar.isOpen,
			setRightSidebar: state.setRightSidebar,
			setPlayer: state.setPlayer,
		})),
	);

	// Audio player state and controls - Context를 통해 깔끔하게 관리
	const {
		autoPlay,
		stop,
		onSeek,
		setPreviousCallback,
		setNextCallback,
		setShuffleCallback,
		setRepeatCallback,
		setEndedCallback,
		isPlaying: contextIsPlaying,
	} = useAudioContext();

	// 개별 상태 구독
	// const contextIsPlaying = useIsPlaying();

	const { toast } = useToast();

	const { mutate: likeMutation } = useLikeProductMutation();
	const { mutate: unlikeProduct } = useUnlikeProductMutation();

	// State to store current audio URL
	const [currentAudioUrl, setCurrentAudioUrl] = useState<string>("");

	// 상품 정보 조회
	const { data: productData } = useQuery({
		...getProductQueryOption(productId!),
		enabled: !!productId,
	});

	// 현재 트랙 재생 시간 (초)
	const currentTime = useCurrentTime();

	// currentTime 을 ref 에 저장하여 최신 값을 유지하지만, 다운로드 링크 재검색 시 effect 재실행을 막습니다.
	const lastPlayedTimeRef = useRef<number>(0);
	const lastPlayedProductIdRef = useRef<number | null>(null);
	useEffect(() => {
		lastPlayedTimeRef.current = currentTime;
	}, [currentTime]);
	useEffect(() => {
		lastPlayedProductIdRef.current = productId;
	}, [productId]);

	// 플레이리스트에 트랙이 하나라도 있으면 플레이어를 표시한다.
	const isVisible = trackIds.length > 0 && productId !== null;

	const onClickLike = () => {
		if (!productId || !productData) return;

		if (!productData?.isLiked) {
			likeMutation(productId, {
				onSuccess: () => {
					// TODO: 상품 데이터 쿼리 invalidate
				},
			});
		} else if (productData?.isLiked) {
			unlikeProduct(productId, {
				onSuccess: () => {
					// TODO: 상품 데이터 쿼리 invalidate
				},
			});
		}
	};

	// 오디오 파일 다운로드 링크 조회 (fetchQuery 사용으로 불필요한 리렌더 방지)
	const queryClient = useQueryClient();
	const [audioFileError, setAudioFileError] = useState<unknown>(null);

	// productId 가 변경될 때마다 현재 재생을 중지하고 상태를 초기화합니다.
	useEffect(() => {
		if (!productId) return;
		// 현재 재생 중지 및 상태 초기화 (isPlaying 동기화는 stop 내부 상태 변화로 일괄 처리)
		stop();
		setCurrentAudioUrl("");
		// 다른 트랙으로 변경될 때 이전 재생 위치를 초기화하여 잘못된 시크 방지
		lastPlayedTimeRef.current = 0;
	}, [productId, stop]);

	useEffect(() => {
		if (!productId) return;

		let cancelled = false;

		const fetchAudioLink = async () => {
			try {
				const audioFileDownloadLink = await queryClient.fetchQuery(
					getProductFileDownloadLinkQueryOption(productId, ENUM_FILE_TYPE.PRODUCT_AUDIO_FILE),
				);

				if (cancelled || !audioFileDownloadLink?.data?.url) return;

				// 현재 재생 중이던 위치를 보존합니다.
				const prevTime = lastPlayedTimeRef.current;
				const prevProductId = lastPlayedProductIdRef.current;

				// 새로 받은 URL 을 설정합니다.
				setCurrentAudioUrl(audioFileDownloadLink.data.url);

				// 플레이어를 초기화합니다.
				stop();

				// 약간의 지연 후 자동 재생 및 이전 위치로 시크합니다.
				const timer = setTimeout(() => {
					autoPlay();
					// 이전에 재생 중이던 위치가 존재하면 해당 위치로 이동합니다.
					if (prevTime > 0 && prevProductId === productId) {
						onSeek(prevTime);
					}
					setIsPlaying(true);
				}, 200);

				return () => clearTimeout(timer);
			} catch (error) {
				if (cancelled) return;
				setAudioFileError(error);
			}
		};

		fetchAudioLink();

		return () => {
			cancelled = true;
		};
	}, [productId, queryClient, stop, autoPlay, onSeek, setIsPlaying]);

	// 이전 트랙 재생 핸들러
	const handlePreviousTrack = () => {
		// 2초(2000ms) 이내라면 실제 이전 곡으로 이동하고,
		// 그 이후라면 현재 곡의 처음으로 되감기
		if (currentTime > 2) {
			// 현재 곡 처음으로 이동
			onSeek(0);
		} else {
			const success = playPreviousTrack();
			if (!success) {
				toast({
					description: "이전 곡이 없습니다.",
				});
			}
		}
	};

	// 다음 트랙 재생 핸들러
	const handleNextTrack = () => {
		const success = playNextTrack();
		if (!success) {
			// 더 이상 재생할 트랙이 없으면
			setIsPlaying(false);
			// 재생 위치 초기화
			stop();
			// 상태를 "ended" 로 설정하되, productId 는 유지하여 현재 트랙 정보를 표시합니다.
			setStatus("ended");

			if (repeatMode === "none") {
				toast({
					description: "플레이리스트가 끝났습니다.",
				});
			}
		}
	};

	// AudioContext와 플레이리스트 연동
	useEffect(() => {
		// AudioContext 콜백들을 플레이리스트 시스템에 연결
		setPreviousCallback(handlePreviousTrack);
		setNextCallback(handleNextTrack);
		setShuffleCallback(toggleShuffle);
		setRepeatCallback(toggleRepeatMode);

		// 트랙 종료 시 처리
		setEndedCallback(() => {
			// 반복 모드가 "one"이면 현재 트랙 재시작
			if (repeatMode === "one") {
				if (productId) {
					// 현재 트랙 다시 재생
					setTimeout(() => {
						autoPlay();
						setIsPlaying(true);
					}, 100);
				}
				return;
			}

			// 다음 트랙으로 자동 진행
			const success = playNextTrack();
			if (!success) {
				// 더 이상 재생할 트랙이 없으면
				setIsPlaying(false);
				// 재생 위치 초기화
				stop();
				// 상태를 "ended" 로 설정하되, productId 는 유지하여 현재 트랙 정보를 표시합니다.
				setStatus("ended");

				if (repeatMode === "none") {
					toast({
						description: "플레이리스트가 끝났습니다.",
					});
				}
			}
		});
	}, [
		handlePreviousTrack,
		handleNextTrack,
		toggleShuffle,
		toggleRepeatMode,
		playNextTrack,
		repeatMode,
		productId,
		autoPlay,
		setIsPlaying,
		toast,
		setPreviousCallback,
		setNextCallback,
		setShuffleCallback,
		setRepeatCallback,
		setEndedCallback,
		setProductId,
		setStatus,
	]);

	/*
	 * FooterPlayer 가 보이지 않으면 (재생할 트랙이 없는 경우)
	 * 우측 플레이리스트 사이드바를 자동으로 닫는다.
	 */
	useEffect(() => {
		if (!isVisible && isOpen) {
			setRightSidebar(false);
		}
	}, [isVisible, isOpen, setRightSidebar]);

	return (
		<DropContentWrapper
			id={"player"}
			asChild
		>
			<div
				className={cn(
					"w-full h-20 bg-white border-t-8 border-black transition-transform duration-300",
					isVisible ? "translate-y-0" : "translate-y-[calc(100%+20px)]",
				)}
			>
				<div className="flex items-center justify-between w-full p-2">
					{/* 트랙 정보 및 좋아요/장바구니 */}
					<div className="flex items-center gap-2 w-96">
						{!productId || !productData ? (
							<div className="flex items-center justify-center w-full">
								<span className="text-gray-500">재생 중인 트랙이 없습니다</span>
							</div>
						) : (
							<>
								<div className="flex items-center justify-between gap-4">
									{productData.coverImage?.url ? (
										<Image
											width={60}
											height={60}
											alt="track-image"
											className="border-black w-14 h-14 cursor-pointer"
											src={productData.coverImage.url}
											loader={assetImageLoader}
											onClick={() => {
												setPlayer({
													trackId: productId,
												});
												setRightSidebar(true, {
													currentType: SidebarType.TRACK,
												});
											}}
										/>
									) : (
										<div className="w-14 h-14 bg-gray-200 border border-black flex items-center justify-center">
											<span className="text-xs text-gray-500">No Image</span>
										</div>
									)}
									<div className="flex flex-col gap-1">
										<Link
											href={`/products/${productData.id}`}
											className="text-xl font-bold leading-none text-black w-40 truncate"
										>
											{productData.productName}
										</Link>
										<Link
											href={`/artists/${productData.seller?.slug}`}
											className="text-base font-bold leading-none w-36 text-black/70 truncate"
										>
											{productData.seller?.stageName}
										</Link>
									</div>
								</div>

								<div className="flex justify-between items-center gap-[10px]">
									<div
										className="flex items-center justify-center w-8 h-8 cursor-pointer"
										onClick={onClickLike}
									>
										{productData.isLiked ? (
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

									<PurchaseWithCartTrigger productId={productId}>
										{({ isOnCart }) => <ShoppingBag color={isOnCart ? "#3884FF" : "white"} />}
									</PurchaseWithCartTrigger>
								</div>
							</>
						)}
					</div>

					{/* 재생 컨트롤 */}
					<div className="flex justify-center flex-1 ">
						<AudioPlayer url={currentAudioUrl} />
					</div>

					{/* 볼륨 컨트롤 */}
					<div className="flex justify-end w-96">
						<VolumeControl />
					</div>
				</div>
			</div>
		</DropContentWrapper>
	);
};
