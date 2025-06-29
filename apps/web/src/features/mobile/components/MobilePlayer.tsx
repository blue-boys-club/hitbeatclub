import Image from "next/image";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { MobileAddCircleSVG } from "./MobileAddCircleSVG";
import { MobileSpeakerSVG } from "./MobileSpeakerSVG";
import { MobileDownArrowSquareSVG } from "./MobileDownArrowSquareSVG";
import { MobilePlayListSquareSVG } from "./MobilePlayListSquareSVG";
import { MobileFullScreenPlayerBeatSVG } from "./MobileFullScreenPlayerBeatSVG";
import { MobileFullScreenPlayerNextSVG } from "./MobileFullScreenPlayerNextSVG";
import { MobileFullScreenPlayerPreviousSVG } from "./MobileFullScreenPlayerPreviousSVG";
import { MobileFullScreenPlayerRepeatSVG } from "./MobileFullScreenPlayerRepeatSVG";
import { MobileFullScreenPlayerShuffleSVG } from "./MobileFullScreenPlayerShuffleSVG";
import { useAudioStore } from "@/stores/audio";
import { usePlayTrack } from "@/hooks/use-play-track";
import { useShallow } from "zustand/react/shallow";
import { useQuery } from "@tanstack/react-query";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import {
	getProductQueryOption,
	getProductFileDownloadLinkQueryOption,
} from "@/apis/product/query/product.query-option";
import { useLikeProductMutation, useUnlikeProductMutation } from "@/apis/product/mutations";
import { ENUM_FILE_TYPE } from "@hitbeatclub/shared-types/file";
import { useToast } from "@/hooks/use-toast";
import { useAudioContext } from "@/contexts/AudioContext";
import { ReactPlayer } from "@/components/layout/Footer/Player/ReactPlayer";
import { Heart } from "@/assets/svgs/Heart";
import { Acapella, AudioBarPause, AudioBarPlay } from "@/assets/svgs";
import { useCreateCartItemMutation } from "@/apis/user/mutations/useCreateCartItemMutation";
import { useAuthStore } from "@/stores/auth";
import { usePlaylistStore, PlaylistProduct } from "@/stores/playlist";

export const MobilePlayer = () => {
	// 확장/축소 상태 관리
	const [isFullScreen, setIsFullScreen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const [showVolumeBar, setShowVolumeBar] = useState(false);

	// 플레이리스트 표시 상태
	const [showPlaylist, setShowPlaylist] = useState(false);

	// 플레이리스트 스토어
	const { playlist, currentIndex, playNext, playPrevious, repeatMode, isShuffleMode, toggleRepeatMode, toggleShuffleMode, setCurrentIndex } = usePlaylistStore(
		useShallow((state) => ({
			playlist: state.playlist,
			currentIndex: state.currentIndex,
			playNext: state.playNext,
			playPrevious: state.playPrevious,
			repeatMode: state.repeatMode,
			isShuffleMode: state.isShuffleMode,
			toggleRepeatMode: state.toggleRepeatMode,
			toggleShuffleMode: state.toggleShuffleMode,
			setCurrentIndex: state.setCurrentIndex,
		})),
	);

	const { play } = usePlayTrack();
	const { currentProductId, isPlaying, setIsPlaying } = useAudioStore(
		useShallow((state) => ({
			currentProductId: state.productId,
			isPlaying: state.isPlaying,
			setIsPlaying: state.setIsPlaying,
		})),
	);

	// 로그인 상태 확인
	const { data: user } = useQuery({ ...getUserMeQueryOption(), retry: false });
	const isLoggedIn = Boolean(user?.id);

	// 상품 정보 조회
	const { data: productData } = useQuery({
		...getProductQueryOption(currentProductId!),
		enabled: !!currentProductId,
	});

	// 좋아요 기능
	const { mutate: likeMutation } = useLikeProductMutation();
	const { mutate: unlikeProduct } = useUnlikeProductMutation();

	// 사용자 ID 가져오기 (장바구니용)
	const userId = useAuthStore(useShallow((state) => state.user?.userId));

	// 장바구니 추가 mutation
	const createCartItemMutation = useCreateCartItemMutation(userId!);

	// 토스트 및 오디오 컨텍스트
	const { toast } = useToast();
	const {
		playerRef,
		autoPlay,
		stop,
		isPlaying: contextIsPlaying,
		onProgress,
		onDuration,
		volume,
		onVolumeChange,
		currentTime,
		duration,
		isUserSeeking,
		onSeek,
		onSeekStart,
		onSeekEnd,
	} = useAudioContext();

	// 시크바 드래그 중 임시 값 저장
	const [tempSeekValue, setTempSeekValue] = useState<number>(currentTime);

	// 현재 오디오 URL 상태
	const [currentAudioUrl, setCurrentAudioUrl] = useState<string>("");

	// 사용자의 명시적인 일시정지 액션 추적
	const [userPausedRef, setUserPausedRef] = useState(false);

	// 오디오 파일 다운로드 링크 조회
	const { data: audioFileDownloadLink, error: audioFileError } = useQuery({
		...getProductFileDownloadLinkQueryOption(currentProductId!, ENUM_FILE_TYPE.PRODUCT_AUDIO_FILE),
		enabled: !!currentProductId,
	});

	const volumeBarRef = useRef<HTMLDivElement>(null);
	const speakerRef = useRef<HTMLDivElement>(null);
	const progressBarRef = useRef<HTMLDivElement>(null);
	const playlistRef = useRef<HTMLDivElement>(null);

	const playIcon = useMemo(() => {
		// AudioContext의 실제 재생 상태를 우선적으로 사용
		const isCurrentlyPlaying = contextIsPlaying;

		if (isCurrentlyPlaying) {
			return isFullScreen ? (
				<AudioBarPause
					width={58}
					height={58}
				/>
			) : (
				<div className="flex w-6 h-6 items-center justify-center">
					<AudioBarPause
						width={20}
						height={20}
					/>
				</div>
			);
		} else {
			return isFullScreen ? (
				<AudioBarPlay
					width={58}
					height={58}
				/>
			) : (
				<div className="flex w-6 h-6 items-center justify-center">
					<AudioBarPlay
						width={20}
						height={20}
					/>
				</div>
			);
		}
	}, [contextIsPlaying, isFullScreen]);

	const onPlayHandler = useCallback(() => {
		if (currentProductId) {
			// 현재 재생 중인 트랙과 같은 트랙을 클릭한 경우
			if (contextIsPlaying) {
				// 일시정지 -> 사용자 액션으로 기록
				setUserPausedRef(true);
			} else {
				// 재생 -> 사용자 일시정지 상태 해제
				setUserPausedRef(false);
			}
			play(currentProductId);
		}
	}, [play, currentProductId, contextIsPlaying]);

	const onClickLike = useCallback(() => {
		if (!currentProductId || !productData) return;

		if (!productData?.isLiked) {
			likeMutation(currentProductId, {
				onSuccess: () => {
					// TODO: 상품 데이터 쿼리 invalidate
				},
			});
		} else if (productData?.isLiked) {
			unlikeProduct(currentProductId, {
				onSuccess: () => {
					// TODO: 상품 데이터 쿼리 invalidate
				},
			});
		}
	}, [currentProductId, productData, likeMutation, unlikeProduct]);

	// 장바구니 추가 핸들러
	const handleAddToCart = useCallback(async () => {
		if (!userId) {
			toast({
				description: "로그인이 필요합니다",
				variant: "destructive",
			});
			return;
		}

		if (!currentProductId || !productData) {
			toast({
				description: "상품 정보를 불러올 수 없습니다",
				variant: "destructive",
			});
			return;
		}

		// 첫 번째 라이센스를 기본값으로 사용 (MobileBuyOrCartModal과 동일한 방식)
		const defaultLicense = productData.licenseInfo?.[0];
		if (!defaultLicense?.id) {
			toast({
				description: "라이센스 정보를 찾을 수 없습니다",
				variant: "destructive",
			});
			return;
		}

		try {
			await createCartItemMutation.mutateAsync({
				productId: currentProductId,
				licenseId: defaultLicense.id,
			});
			toast({
				description: "장바구니에 추가되었습니다",
			});
		} catch (error) {
			console.error("장바구니 추가 실패:", error);
			toast({
				description: "장바구니 추가에 실패했습니다",
				variant: "destructive",
			});
		}
	}, [userId, currentProductId, productData, createCartItemMutation, toast]);

	// 풀스크린으로 전환
	const handleShowFullScreen = useCallback(() => {
		setIsFullScreen(true);
		setIsClosing(false);
	}, []);

	// 풀스크린에서 축소
	const handleHideFullScreen = useCallback(() => {
		setIsClosing(true);
		// 애니메이션 완료 후 상태 변경
		setTimeout(() => {
			setIsFullScreen(false);
			setIsClosing(false);
		}, 300);
	}, []);

	// 플레이리스트 토글 핸들러
	const handleTogglePlaylist = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		setShowPlaylist((prev) => !prev);
	}, []);

	// 플레이리스트 아이템 클릭 핸들러
	const handlePlaylistItemClick = useCallback(
		(productId: number) => {
			// 클릭한 곡의 인덱스를 찾아서 currentIndex 업데이트
			const clickedIndex = playlist.findIndex(item => item.id === productId);
			if (clickedIndex !== -1) {
				setCurrentIndex(clickedIndex);
			}
			
			play(productId);
			setShowPlaylist(false);
		},
		[play, playlist, setCurrentIndex],
	);

	// 이전 곡 재생 핸들러
	const handlePreviousTrack = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();

			if (playlist.length <= 1) return; // 단일 곡이거나 빈 플레이리스트면 무시

			const previousTrack = playPrevious();
			if (previousTrack) {
				// 사용자 일시정지 상태 해제
				setUserPausedRef(false);
				play(previousTrack.id);
			}
		},
		[playlist.length, playPrevious, play],
	);

	// 다음 곡 재생 핸들러
	const handleNextTrack = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();

			if (playlist.length <= 1) return; // 단일 곡이거나 빈 플레이리스트면 무시

			const nextTrack = playNext();
			if (nextTrack) {
				// 사용자 일시정지 상태 해제
				setUserPausedRef(false);
				play(nextTrack.id);
			}
		},
		[playlist.length, playNext, play],
	);

	// Previous/Next 버튼 사용 가능 여부
	const canNavigate = playlist.length > 1;

	// Repeat 버튼 클릭 핸들러
	const handleRepeatToggle = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		toggleRepeatMode();
	}, [toggleRepeatMode]);

	// Shuffle 버튼 클릭 핸들러
	const handleShuffleToggle = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		toggleShuffleMode();
	}, [toggleShuffleMode]);

	// 곡이 끝났을 때 자동으로 다음 곡 재생
	const handleTrackEnded = useCallback(() => {
		if (repeatMode === 'all') {
			// 전체 반복 모드: 항상 다음 곡으로 (순환)
			if (playlist.length > 1) {
				const nextTrack = playNext();
				if (nextTrack) {
					setUserPausedRef(false);
					play(nextTrack.id);
				}
			} else if (playlist.length === 1) {
				// 단일 곡 반복
				if (currentProductId) {
					setUserPausedRef(false);
					play(currentProductId);
				}
			}
		} else if (repeatMode === 'none') {
			// 반복 없음 모드: 마지막 곡이 아니면 다음 곡, 마지막 곡이면 정지
			if (playlist.length > 1 && currentIndex < playlist.length - 1) {
				// 순환하지 않는 선형 진행으로 다음 곡 재생
				const nextIndex = currentIndex + 1;
				const nextTrack = playlist[nextIndex];
				
				if (nextTrack) {
					setCurrentIndex(nextIndex);
					setUserPausedRef(false);
					play(nextTrack.id);
				}
			}
			// 마지막 곡이거나 단일 곡이면 재생 종료 (자연스럽게 정지)
		}
	}, [playlist, currentIndex, playNext, play, repeatMode, currentProductId, setCurrentIndex]);

	// 플레이리스트 컴포넌트
	const PlaylistModal = useCallback(() => {
		if (!showPlaylist || playlist.length === 0) return null;

		return (
			<div
				ref={playlistRef}
				className="absolute top-full right-0 mt-2 w-52 border-2 border-black bg-white p-4 z-50 max-h-96 overflow-y-auto"
				onClick={(e) => e.stopPropagation()}
			>
				{playlist.slice(0, 9).map((item: PlaylistProduct, index: number) => (
					<div
						key={item.id}
						className={`flex gap-3 mb-2.5 last:mb-0 cursor-pointer hover:bg-gray-100 p-1 rounded ${
							currentIndex === index ? "bg-gray-200" : ""
						}`}
						onClick={() => handlePlaylistItemClick(item.id)}
					>
						<div className="w-10 h-10 relative border border-black flex-shrink-0">
							{item.coverImage?.url ? (
								<Image
									src={item.coverImage.url}
									alt="cover"
									fill
									className="object-cover"
								/>
							) : (
								<div className="w-full h-full bg-gray-200 flex items-center justify-center">
									<span className="text-xs text-gray-500">No Image</span>
								</div>
							)}
						</div>
						<div className="flex flex-col justify-center flex-1 min-w-0">
							<div className="font-bold text-sm leading-4 truncate">{item.productName}</div>
							<div className="font-medium text-xs leading-4 text-gray-600 truncate">
								{item.seller?.stageName || "Unknown Artist"}
							</div>
						</div>
					</div>
				))}
			</div>
		);
	}, [showPlaylist, playlist, currentIndex, handlePlaylistItemClick]);

	// 시간을 mm:ss 형식으로 변환하는 함수
	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60);
		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	// 스피커 아이콘 클릭 핸들러
	const handleSpeakerClick = useCallback(() => {
		setShowVolumeBar(!showVolumeBar);
	}, [showVolumeBar]);

	// 볼륨바 드래그/터치 핸들러
	const handleVolumeChange = useCallback(
		(event: React.MouseEvent | React.TouchEvent) => {
			if (!volumeBarRef.current) return;

			const rect = volumeBarRef.current.getBoundingClientRect();
			const clientY = "touches" in event ? event.touches[0]?.clientY : event.clientY;
			if (clientY === undefined) return;

			const relativeY = rect.bottom - clientY;
			const newVolume = Math.max(0, Math.min(1, relativeY / rect.height));

			onVolumeChange(newVolume);
		},
		[onVolumeChange],
	);

	// 볼륨바 드래그 이벤트 핸들러
	const handleMouseDown = useCallback(
		(event: React.MouseEvent) => {
			event.stopPropagation();
			handleVolumeChange(event);

			const handleMouseMove = (e: MouseEvent) => {
				const rect = volumeBarRef.current?.getBoundingClientRect();
				if (!rect) return;

				const relativeY = rect.bottom - e.clientY;
				const newVolume = Math.max(0, Math.min(1, relativeY / rect.height));
				onVolumeChange(newVolume);
			};

			const handleMouseUp = () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
			};

			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		},
		[handleVolumeChange, onVolumeChange],
	);

	// 볼륨바 터치 이벤트 핸들러
	const handleTouchStart = useCallback(
		(event: React.TouchEvent) => {
			event.stopPropagation();
			handleVolumeChange(event);

			const handleTouchMove = (e: TouchEvent) => {
				e.preventDefault();
				const rect = volumeBarRef.current?.getBoundingClientRect();
				if (!rect || !e.touches[0]) return;

				const relativeY = rect.bottom - e.touches[0].clientY;
				const newVolume = Math.max(0, Math.min(1, relativeY / rect.height));
				onVolumeChange(newVolume);
			};

			const handleTouchEnd = () => {
				document.removeEventListener("touchmove", handleTouchMove);
				document.removeEventListener("touchend", handleTouchEnd);
			};

			document.addEventListener("touchmove", handleTouchMove, { passive: false });
			document.addEventListener("touchend", handleTouchEnd);
		},
		[handleVolumeChange, onVolumeChange],
	);

	// 재생바 드래그/터치 핸들러
	const handleProgressChange = useCallback(
		(event: React.MouseEvent | React.TouchEvent) => {
			if (!progressBarRef.current || duration === 0) return;

			const rect = progressBarRef.current.getBoundingClientRect();
			const clientX = "touches" in event ? event.touches[0]?.clientX : event.clientX;
			if (clientX === undefined) return;

			const relativeX = clientX - rect.left;
			const progress = Math.max(0, Math.min(1, relativeX / rect.width));
			const newTime = progress * duration;

			setTempSeekValue(newTime);
			return newTime;
		},
		[duration],
	);

	// 재생바 드래그 이벤트 핸들러
	const handleProgressMouseDown = useCallback(
		(event: React.MouseEvent) => {
			onSeekStart();
			const newTime = handleProgressChange(event);
			if (newTime !== undefined) {
				onSeek(newTime); // 클릭 시 즉시 해당 지점으로 이동
			}

			const handleMouseMove = (e: MouseEvent) => {
				const rect = progressBarRef.current?.getBoundingClientRect();
				if (!rect || duration === 0) return;

				const relativeX = e.clientX - rect.left;
				const progress = Math.max(0, Math.min(1, relativeX / rect.width));
				const newTime = progress * duration;
				setTempSeekValue(newTime);
				onSeek(newTime); // 드래그 중에도 실시간 업데이트
			};

			const handleMouseUp = () => {
				onSeekEnd();
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
			};

			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		},
		[handleProgressChange, onSeekStart, onSeek, onSeekEnd, duration],
	);

	// 재생바 터치 이벤트 핸들러
	const handleProgressTouchStart = useCallback(
		(event: React.TouchEvent) => {
			onSeekStart();
			const newTime = handleProgressChange(event);
			if (newTime !== undefined) {
				onSeek(newTime); // 터치 시 즉시 해당 지점으로 이동
			}

			const handleTouchMove = (e: TouchEvent) => {
				e.preventDefault();
				const rect = progressBarRef.current?.getBoundingClientRect();
				if (!rect || !e.touches[0] || duration === 0) return;

				const relativeX = e.touches[0].clientX - rect.left;
				const progress = Math.max(0, Math.min(1, relativeX / rect.width));
				const newTime = progress * duration;
				setTempSeekValue(newTime);
				onSeek(newTime); // 터치 드래그 중에도 실시간 업데이트
			};

			const handleTouchEnd = () => {
				onSeekEnd();
				document.removeEventListener("touchmove", handleTouchMove);
				document.removeEventListener("touchend", handleTouchEnd);
			};

			document.addEventListener("touchmove", handleTouchMove, { passive: false });
			document.addEventListener("touchend", handleTouchEnd);
		},
		[handleProgressChange, onSeekStart, onSeek, onSeekEnd, duration],
	);

	// 볼륨바 외부 클릭 감지
	useEffect(() => {
		const handleClickOutside = (event: Event) => {
			if (
				volumeBarRef.current &&
				!volumeBarRef.current.contains(event.target as Node) &&
				speakerRef.current &&
				!speakerRef.current.contains(event.target as Node)
			) {
				setShowVolumeBar(false);
			}
		};

		if (showVolumeBar) {
			document.addEventListener("mousedown", handleClickOutside);
			document.addEventListener("touchstart", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
		};
	}, [showVolumeBar]);

	// 플레이리스트 외부 클릭 감지
	useEffect(() => {
		const handleClickOutside = (event: Event) => {
			if (playlistRef.current && !playlistRef.current.contains(event.target as Node)) {
				setShowPlaylist(false);
			}
		};

		if (showPlaylist) {
			document.addEventListener("mousedown", handleClickOutside);
			document.addEventListener("touchstart", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
		};
	}, [showPlaylist]);

	// 음원이 변경될 때 처리
	useEffect(() => {
		if (!currentProductId) return;

		// 기존 오디오 URL과 다른 경우에만 초기화
		if (currentAudioUrl && audioFileDownloadLink?.url !== currentAudioUrl) {
			setCurrentAudioUrl("");
		}
	}, [currentProductId, currentAudioUrl, audioFileDownloadLink?.url]);

	// 오디오 파일 다운로드 링크가 변경될 때마다 재생
	useEffect(() => {
		if (audioFileDownloadLink?.url && audioFileDownloadLink.url !== currentAudioUrl) {
			setCurrentAudioUrl(audioFileDownloadLink.url);

			// 새로운 트랙이 시작되므로 사용자 일시정지 상태 초기화
			setUserPausedRef(false);

			// 새로운 트랙이므로 stop 후 autoPlay
			stop();
			const timer = setTimeout(() => {
				autoPlay();
			}, 300); // 조금 더 여유있는 타이밍
			return () => clearTimeout(timer);
		}
	}, [audioFileDownloadLink, currentAudioUrl, stop, autoPlay]);

	// 오디오 파일 다운로드 에러 처리
	useEffect(() => {
		if (audioFileError) {
			toast({
				description: "오디오 파일을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.",
				variant: "destructive",
			});
		}
	}, [audioFileError, toast]);

	// AudioContext 재생 상태를 글로벌 스토어와 동기화 (단방향: Context -> Store)
	useEffect(() => {
		if (isPlaying !== contextIsPlaying) {
			setIsPlaying(contextIsPlaying);
		}
	}, [isPlaying, contextIsPlaying, setIsPlaying]);

	// 새로운 트랙이 로드되었을 때 재생 상태 확인
	useEffect(() => {
		if (currentAudioUrl && currentProductId && !contextIsPlaying && !userPausedRef) {
			// 오디오 URL이 설정되었는데 재생되지 않는 경우, 잠시 후 재생 시도
			// 단, 사용자가 명시적으로 일시정지한 경우에는 자동 재생하지 않음
			const timer = setTimeout(() => {
				if (!contextIsPlaying && !userPausedRef) {
					autoPlay();
				}
			}, 500);
			return () => clearTimeout(timer);
		}
	}, [currentAudioUrl, currentProductId, contextIsPlaying, userPausedRef, autoPlay]);

	// 사용자가 시크바를 조작하지 않을 때만 currentTime과 동기화
	useEffect(() => {
		if (!isUserSeeking) {
			setTempSeekValue(currentTime);
		}
	}, [currentTime, isUserSeeking]);

	if (!currentProductId || !isLoggedIn) {
		return null;
	}

	return (
		<>
			{/* 단일 ReactPlayer */}
			<ReactPlayer
				ref={playerRef}
				url={currentAudioUrl}
				playing={contextIsPlaying}
				controls={false}
				width="0"
				height="0"
				volume={volume}
				onEnded={handleTrackEnded}
				onProgress={({ playedSeconds }) => onProgress(playedSeconds)}
				onDuration={(duration) => onDuration(duration)}
			/>

			{/* Footer PlayBar UI - 기본 상태 */}
			{!isFullScreen && (
				<div
					className="fixed bottom-72px left-0 right-0 z-40 flex gap-3 border-t-4px border-black p-2 bg-white"
					onClick={handleShowFullScreen}
				>
					<div className="shrink-0 w-50px h-50px relative border-5px border-black">
						{productData?.coverImage?.url ? (
							<Image
								alt="cover image"
								src={productData.coverImage.url}
								fill
								className="object-cover"
							/>
						) : (
							<div className="w-full h-full bg-gray-200 flex items-center justify-center">
								<span className="text-xs text-gray-500">No Image</span>
							</div>
						)}
					</div>
					<div className="flex-1 flex flex-col justify-between">
						<div className="flex justify-between">
							<div className="flex-1 flex flex-col gap-3px min-w-0 w-[calc(100vw-200px)] overflow-x-auto whitespace-nowrap mr-2">
								<div className="font-bold text-20px leading-16px">{productData?.productName || "Loading..."}</div>
								<div className="font-bold text-14px leading-16px">
									{productData?.seller?.stageName || "Unknown Artist"}
								</div>
							</div>
							<div className="flex gap-3 flex-shrink-0">
								<div className="flex gap-5px relative items-start">
									<div
										className="cursor-pointer"
										onClick={(e) => {
											e.stopPropagation();
											onClickLike();
										}}
									>
										<div
											style={{
												transform: "translateY(2px)",
											}}
										>
											<Heart
												width="20px"
												height="20px"
												active={!!productData?.isLiked}
											/>
										</div>
									</div>
									<div
										className="cursor-pointer"
										onClick={(e) => {
											e.stopPropagation();
											handleAddToCart();
										}}
									>
										<MobileAddCircleSVG />
									</div>
									<div
										ref={speakerRef}
										onClick={(e) => {
											e.stopPropagation();
											handleSpeakerClick();
										}}
										className="cursor-pointer"
									>
										<MobileSpeakerSVG />
									</div>

									{/* 볼륨바 */}
									{showVolumeBar && (
										<div
											ref={volumeBarRef}
											className="absolute bottom-full right-4px mb-5 w-14px h-64px bg-white p-1 z-50"
											style={{ boxShadow: "0px 4px 20px 0px #0000004D" }}
											onClick={(e) => e.stopPropagation()}
											onMouseDown={handleMouseDown}
											onTouchStart={handleTouchStart}
										>
											<div className="relative w-full h-full flex justify-center">
												{/* 배경 바 */}
												<div className="absolute w-1px h-full bg-black" />
												{/* 볼륨 레벨 바 */}
												<div
													className="absolute bottom-0 w-4px bg-black"
													style={{ height: `${volume * 100}%` }}
												/>
											</div>
										</div>
									)}
								</div>
								<div>
									<button
										onClick={(e) => {
											e.stopPropagation();
											onPlayHandler();
										}}
									>
										{playIcon}
									</button>
								</div>
							</div>
						</div>
						<div
							ref={progressBarRef}
							className="relative w-full h-6px flex items-center cursor-pointer"
							onMouseDown={handleProgressMouseDown}
							onTouchStart={handleProgressTouchStart}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="absolute w-full h-2px bg-black" />
							<div
								className="absolute h-6px bg-black"
								style={{
									width: `${duration > 0 ? ((isUserSeeking ? tempSeekValue : currentTime) / duration) * 100 : 0}%`,
								}}
							/>
						</div>
					</div>
				</div>
			)}

			{/* Full Screen Player UI - 확장 상태 */}
			{(isFullScreen || isClosing) && (
				<div
					className={`bg-white z-[1000] fixed top-0 left-0 right-0 bottom-0 flex flex-col ${
						isClosing ? "animate-slide-down" : "animate-slide-up"
					}`}
				>
					<div className="relative flex-1 flex flex-col pb-108px overflow-y-auto">
						<div className="w-full aspect-square p-4 relative flex flex-col">
							<div className="absolute top-9 left-3 right-3 -bottom-3 pointer-events-none">
								<div className="relative w-full h-full overflow-hidden rounded-full border-6px border-black">
									{productData?.coverImage?.url ? (
										<Image
											src={productData.coverImage.url}
											alt="cover"
											fill
											className="object-cover"
										/>
									) : (
										<div className="w-full h-full bg-gray-200 flex items-center justify-center">
											<span className="text-gray-500">No Image</span>
										</div>
									)}
								</div>
							</div>
							<div className="flex justify-between">
								<button onClick={handleHideFullScreen}>
									<MobileDownArrowSquareSVG />
								</button>
								<div className="relative">
									<button onClick={handleTogglePlaylist}>
										<MobilePlayListSquareSVG />
									</button>
									<PlaylistModal />
								</div>
							</div>
						</div>
						<div className="mt-8 flex flex-col px-4 pb-4">
							<div className="font-bold text-32px leading-40px">{productData?.productName || "Loading..."}</div>
							<div className="flex justify-between">
								<span className="font-[450] text-18px leading-100% flex-1 mr-2">
									{productData?.seller?.stageName || "Unknown Artist"}
								</span>
								{productData?.category !== "BEAT" ? <MobileFullScreenPlayerBeatSVG /> : <Acapella />}
							</div>
						</div>
						<div className="px-4 flex flex-col">
							<div
								ref={progressBarRef}
								className="relative w-full h-6px flex items-center cursor-pointer"
								onMouseDown={handleProgressMouseDown}
								onTouchStart={handleProgressTouchStart}
							>
								<div className="w-full h-2px bg-black" />
								<div
									className="absolute h-6px bg-black"
									style={{
										width: `${duration > 0 ? ((isUserSeeking ? tempSeekValue : currentTime) / duration) * 100 : 0}%`,
									}}
								/>
							</div>
							<div className="flex justify-between mt-3px text-12px font-[450] leading-16px">
								<span>{formatTime(isUserSeeking ? tempSeekValue : currentTime)}</span>
								<span>{formatTime(duration)}</span>
							</div>
						</div>
						<div className="px-4 mt-3 text-14px font-[450] leading-18px">
							<span>General Information</span>
							<br />
							<p className="text-hbc-gray-300">
								Kind : MPEG audio file
								<br />
								Time : 4:32
								<br />
								Size : 5.8MB
								<br />
								Date : 4/12/2024 10:47 PM
							</p>
							<br />
							<span>Detail Information</span>
							<br />
							<p className="text-hbc-gray-300">
								Bit Rate : 160kbps
								<br />
								Sample Rate : 44.100 kHz
								<br />
								Channels : Joint Stereo
								<br />
								ID3 tag : v2.2
								<br />
								Encoded by : X v2.0.1
							</p>
						</div>
					</div>
					<div className="fixed bg-white bottom-72px left-0 right-0 px-4 py-6 flex justify-between">
						<div className="flex flex-col">
							<button className="h-30px font-bold text-16px leading-16px text-black border-4px border-black rounded-40px">
								Free Download
							</button>
							<button className="font-bold text-16px leading-16px text-white bg-black h-30px px-2 border-4px border-black rounded-40px flex items-center gap-2">
								<MobileAddCircleSVG fill="white" />
								15,000 KRW
							</button>
						</div>
						<div className="self-end">
							<div
								className="cursor-pointer"
								onClick={onClickLike}
							>
								<Heart
									width="24"
									height="24"
									active={!!productData?.isLiked}
								/>
							</div>
						</div>
					</div>
					<div className="h-auto border-t-10px border-black px-2 py-1 flex items-center justify-between">
						<button onClick={handleRepeatToggle}>
							<MobileFullScreenPlayerRepeatSVG mode={repeatMode} />
						</button>
						<button
							onClick={handlePreviousTrack}
							disabled={!canNavigate}
							className="disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
						>
							<MobileFullScreenPlayerPreviousSVG />
						</button>
						<button onClick={onPlayHandler}>{playIcon}</button>
						<button
							onClick={handleNextTrack}
							disabled={!canNavigate}
							className="disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
						>
							<MobileFullScreenPlayerNextSVG />
						</button>
						<button onClick={handleShuffleToggle}>
							<MobileFullScreenPlayerShuffleSVG active={isShuffleMode} />
						</button>
					</div>
				</div>
			)}
			<style jsx>
				{`
					* {
						-ms-overflow-style: none;
						scrollbar-width: none;
					}
					*::-webkit-scrollbar {
						display: none;
					}
				`}
			</style>
		</>
	);
};
