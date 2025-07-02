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
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { usePlaylist } from "@/hooks/use-playlist";
import { MobilePurchaseWithCartTrigger } from "../product/components/MobilePurchaseWithCartTrigger";

export const MobilePlayer = () => {
	// 확장/축소 상태 관리
	const [isFullScreen, setIsFullScreen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const [showVolumeBar, setShowVolumeBar] = useState(false);

	// 플레이리스트 표시 상태
	const [showPlaylist, setShowPlaylist] = useState(false);

	// Playlist hook (replaces direct store access)
	const {
		trackIds,
		currentIndex,
		playNextTrack,
		playPreviousTrack,
		repeatMode,
		isShuffleEnabled,
		toggleRepeatMode,
		toggleShuffle,
		setCurrentIndex,
		handleUnplayableTrack,
	} = usePlaylist();

	const { play } = usePlayTrack();
	const { currentProductId, isPlaying, setIsPlaying, setStatus } = useAudioStore(
		useShallow((state) => ({
			currentProductId: state.productId,
			isPlaying: state.isPlaying,
			setIsPlaying: state.setIsPlaying,
			setStatus: state.setStatus,
		})),
	);

	// 상품 정보 조회
	const { data: productData } = useQuery({
		...getProductQueryOption(currentProductId!),
		enabled: !!currentProductId,
	});

	// 좋아요 기능
	const { mutate: likeMutation } = useLikeProductMutation();
	const { mutate: unlikeProduct } = useUnlikeProductMutation();

	// 토스트 및 오디오 컨텍스트
	const { toast } = useToast();
	const {
		playerRef,
		autoPlay,
		stop,
		isPlaying: contextIsPlaying,
		togglePlay,
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

	// 사용자의 명시적인 일시정지 액션 추적 - 개선된 추적 로직
	const [userPausedRef, setUserPausedRef] = useState(false);

	// 트랙 변경 감지를 위한 이전 productId 추적 - null로 초기화하여 첫 번째 트랙도 변경으로 감지
	const prevProductIdRef = useRef<number | null>(null);

	// 이전 재생 상태를 추적하여 외부 토글(예: 트랙 리스트 클릭)에 의한 일시정지를 감지
	const prevContextPlayingRef = useRef(contextIsPlaying);

	// 오디오 파일 다운로드 링크(state & fetchQuery)
	const queryClient = useQueryClient();
	const [audioFileDownloadUrl, setAudioFileDownloadUrl] = useState<string>("");
	const [audioFileError, setAudioFileError] = useState<unknown>(null);

	const volumeBarRef = useRef<HTMLDivElement>(null);
	const speakerRef = useRef<HTMLDivElement>(null);
	const progressBarRef = useRef<HTMLDivElement>(null);
	const playlistRef = useRef<HTMLDivElement>(null);

	const playIcon = useMemo(() => {
		// AudioContext의 실제 재생 상태를 우선적으로 사용
		const isCurrentlyPlaying = contextIsPlaying;
		const hasValidAudio = currentAudioUrl && currentAudioUrl.trim() !== "";

		// 오디오 URL이 없으면 비활성화된 플레이 아이콘 표시
		if (!hasValidAudio) {
			return isFullScreen ? (
				<div className="opacity-50">
					<AudioBarPlay
						width={58}
						height={58}
					/>
				</div>
			) : (
				<div className="flex w-6 h-6 items-center justify-center opacity-50">
					<AudioBarPlay
						width={20}
						height={20}
					/>
				</div>
			);
		}

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
	}, [contextIsPlaying, isFullScreen, currentAudioUrl]);

	const onPlayHandler = useCallback(() => {
		if (!currentProductId) return;

		// 유효한 오디오 URL이 없으면 재생 방지
		if (!currentAudioUrl || currentAudioUrl.trim() === "") {
			console.warn(`[MobilePlayer] Cannot play - no valid audio URL`);
			toast({
				description: "재생할 수 없는 트랙입니다.",
				variant: "destructive",
			});
			return;
		}

		if (contextIsPlaying) {
			// 일시정지 -> 사용자 액션으로 기록
			setUserPausedRef(true);
		} else {
			// 재생 -> 사용자 일시정지 상태 해제
			setUserPausedRef(false);
		}

		// 같은 트랙일 경우 AudioContext 토글만 수행
		togglePlay();
	}, [currentProductId, currentAudioUrl, contextIsPlaying, togglePlay, toast]);

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

	// 모달에서 사용할 상품 객체 (licenseInfo.label 호환성 유지)
	const triggerProduct = useMemo(() => {
		if (!productData) return null;
		// map licenseInfo to include label field if missing
		const licenseInfo = (productData.licenseInfo || []).map((lic: any) =>
			lic.label ? lic : { ...lic, label: lic.type[0] + lic.type.slice(1).toLowerCase() },
		);
		return { ...productData, licenseInfo } as any;
	}, [productData]);

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
			const clickedIndex = trackIds.indexOf(productId);
			if (clickedIndex !== -1) {
				setCurrentIndex(clickedIndex);
			}

			play(productId);
			setShowPlaylist(false);
		},
		[play, trackIds, setCurrentIndex],
	);

	// 이전 곡 재생 핸들러
	const handlePreviousTrack = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();

			if (trackIds.length <= 1) return; // 단일 곡이거나 빈 플레이리스트면 무시

			const success = playPreviousTrack();
			if (success) {
				// 사용자 일시정지 상태 해제
				setUserPausedRef(false);
			}
		},
		[trackIds.length, playPreviousTrack],
	);

	// 다음 곡 재생 핸들러
	const handleNextTrack = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();

			if (trackIds.length <= 1) return; // 단일 곡이거나 빈 플레이리스트면 무시

			const success = playNextTrack();
			if (success) {
				// 사용자 일시정지 상태 해제
				setUserPausedRef(false);
			}
		},
		[trackIds.length, playNextTrack],
	);

	// Previous/Next 버튼 사용 가능 여부
	const canNavigate = trackIds.length > 1;

	// Repeat 버튼 클릭 핸들러
	const handleRepeatToggle = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			toggleRepeatMode();
		},
		[toggleRepeatMode],
	);

	// Shuffle 버튼 클릭 핸들러
	const handleShuffleToggle = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			toggleShuffle();
		},
		[toggleShuffle],
	);

	// 곡이 끝났을 때 자동으로 다음 곡 재생
	const handleTrackEnded = useCallback(() => {
		if (repeatMode === "one") {
			if (currentProductId) {
				setTimeout(() => {
					play(currentProductId);
				}, 100);
			}
			return;
		}

		const success = playNextTrack();
		if (!success) {
			// 더 이상 재생할 트랙이 없는 경우 처리할 로직이 있으면 여기에 추가
		}
	}, [repeatMode, currentProductId, play, playNextTrack]);

	// 오디오 로딩/재생 에러 핸들러
	const handleAudioError = useCallback(
		(error: any) => {
			console.error(`[MobilePlayer] Audio error for track ${currentProductId}:`, error);

			if (!currentProductId) return;

			// 현재 오디오 URL 초기화
			setCurrentAudioUrl("");

			// 토스트 메시지 표시
			toast({
				description: "오디오 파일을 재생할 수 없습니다.",
				variant: "destructive",
			});

			// 트랙을 재생 불가로 마킹하고 다음 트랙으로 이동 시도
			handleUnplayableTrack(currentProductId);

			// 재생 상태 정리
			setIsPlaying(false);
			setStatus("paused");
		},
		[currentProductId, toast, handleUnplayableTrack, setIsPlaying, setStatus],
	);

	// 플레이리스트 컴포넌트
	const PlaylistModal = useCallback(() => {
		if (!showPlaylist || trackIds.length === 0) return null;

		return (
			<div
				ref={playlistRef}
				className="absolute top-full right-0 mt-2 w-52 border-2 border-black bg-white p-4 z-50 max-h-96 overflow-y-auto"
				onClick={(e) => e.stopPropagation()}
			>
				{trackIds.slice(0, 9).map((id: number, index: number) => (
					<div
						key={id}
						className={`flex gap-3 mb-2.5 last:mb-0 cursor-pointer hover:bg-gray-100 p-1 rounded ${
							currentIndex === index ? "bg-gray-200" : ""
						}`}
						onClick={() => handlePlaylistItemClick(id)}
					>
						<div className="w-10 h-10 flex items-center justify-center border border-black flex-shrink-0">
							<span className="text-xs text-gray-500">#{index + 1}</span>
						</div>
					</div>
				))}
			</div>
		);
	}, [showPlaylist, trackIds, currentIndex, handlePlaylistItemClick]);

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

	// 음원이 변경될 때 처리 - 개선된 로직
	useEffect(() => {
		// 트랙 변경 감지
		const isTrackChanged = prevProductIdRef.current !== currentProductId;

		if (isTrackChanged && currentProductId) {
			console.log(`[MobilePlayer] Track changed: ${prevProductIdRef.current} -> ${currentProductId}`);

			// 기존 오디오 URL 초기화
			if (currentAudioUrl) {
				setCurrentAudioUrl("");
			}

			// 새로운 트랙이므로 사용자 일시정지 상태 초기화
			setUserPausedRef(false);

			// 이전 productId 업데이트
			prevProductIdRef.current = currentProductId;
		}
	}, [currentProductId, currentAudioUrl]);

	// 오디오 파일 다운로드 링크(state & fetchQuery) - 개선된 로직
	useEffect(() => {
		if (!currentProductId) return;

		let cancelled = false;

		const fetchAudioLink = async () => {
			try {
				console.log(`[MobilePlayer] Fetching audio link for product ${currentProductId}`);

				const linkData = await queryClient.fetchQuery(
					getProductFileDownloadLinkQueryOption(currentProductId, ENUM_FILE_TYPE.PRODUCT_AUDIO_FILE),
				);

				if (cancelled) return;

				const newUrl = linkData?.data?.url ?? "";

				if (!newUrl) {
					throw new Error("No audio URL returned from server");
				}

				console.log(`[MobilePlayer] Audio link fetched: ${newUrl}`);

				setAudioFileDownloadUrl(newUrl);
				setAudioFileError(null);
			} catch (err) {
				if (cancelled) return;

				console.error(`[MobilePlayer] Audio link fetch error:`, err);
				setAudioFileError(err);

				// 오디오 URL 초기화
				setAudioFileDownloadUrl("");
				setCurrentAudioUrl("");

				// 토스트 메시지 표시
				toast({
					description: "오디오 파일 다운로드 링크를 가져올 수 없습니다.",
					variant: "destructive",
				});

				// 트랙을 재생 불가로 마킹하고 다음 트랙으로 이동 시도
				handleUnplayableTrack(currentProductId);

				// 재생 상태 정리
				setIsPlaying(false);
				setStatus("paused");
			}
		};

		fetchAudioLink();

		return () => {
			cancelled = true;
		};
	}, [currentProductId, queryClient, toast, handleUnplayableTrack, setIsPlaying, setStatus]);

	// AudioContext 재생 상태를 글로벌 스토어와 동기화 (단방향: Context -> Store)
	useEffect(() => {
		if (isPlaying !== contextIsPlaying) {
			setIsPlaying(contextIsPlaying);
			setStatus(contextIsPlaying ? "playing" : "paused");
		}
	}, [isPlaying, contextIsPlaying, setIsPlaying, setStatus]);

	// 새로운 트랙이 로드되었을 때 재생 상태 확인 - 개선된 로직
	useEffect(() => {
		if (audioFileDownloadUrl && audioFileDownloadUrl !== currentAudioUrl) {
			console.log(`[MobilePlayer] Loading new audio URL: ${audioFileDownloadUrl}`);

			setCurrentAudioUrl(audioFileDownloadUrl);

			// 새로운 트랙이 시작되므로 사용자 일시정지 상태 초기화
			setUserPausedRef(false);

			// 새로운 트랙이므로 stop 후 짧은 지연 후 autoPlay
			stop();

			// 더 짧은 지연으로 변경하고 로깅 추가
			const timer = setTimeout(() => {
				// 유효한 URL이 있을 때만 재생 시도
				if (audioFileDownloadUrl && audioFileDownloadUrl.trim() !== "") {
					console.log(`[MobilePlayer] Auto-playing new track`);
					autoPlay();
					// FooterPlayer와 같이 명시적으로 재생 상태 설정
					setIsPlaying(true);
					setStatus("playing");
				} else {
					console.warn(`[MobilePlayer] Cannot play track - invalid audio URL`);
					setIsPlaying(false);
					setStatus("paused");
				}
			}, 100); // 300ms -> 100ms로 단축

			return () => clearTimeout(timer);
		}
	}, [audioFileDownloadUrl, currentAudioUrl, stop, autoPlay, setIsPlaying, setStatus]);

	// 오디오 URL은 설정되었지만 재생이 시작되지 않은 경우(loading 등) 자동 재생 시도 - 개선된 로직
	useEffect(() => {
		if (currentAudioUrl && currentProductId && !contextIsPlaying && !userPausedRef) {
			console.log(`[MobilePlayer] Audio loaded but not playing, attempting auto-play`);

			const timer = setTimeout(() => {
				if (!contextIsPlaying && !userPausedRef) {
					console.log(`[MobilePlayer] Retrying auto-play`);
					autoPlay();
					setIsPlaying(true);
					setStatus("playing");
				}
			}, 300); // 500ms -> 300ms로 단축

			return () => clearTimeout(timer);
		}
	}, [currentAudioUrl, currentProductId, contextIsPlaying, userPausedRef, autoPlay, setIsPlaying, setStatus]);

	// 오디오 URL이 초기화되었을 때 재생 중지
	useEffect(() => {
		if (!currentAudioUrl || currentAudioUrl.trim() === "") {
			console.log(`[MobilePlayer] Audio URL cleared, stopping playback`);
			stop();
			setIsPlaying(false);
			setStatus("paused");
		}
	}, [currentAudioUrl, stop, setIsPlaying, setStatus]);

	// 사용자가 시크바를 조작하지 않을 때만 currentTime과 동기화
	useEffect(() => {
		if (!isUserSeeking) {
			setTempSeekValue(currentTime);
		}
	}, [currentTime, isUserSeeking]);

	// 스페이스바로 재생/일시정지 토글
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			// 스페이스바가 아닌 경우 무시
			if (event.code !== "Space") return;

			// input, textarea 등에 포커스가 있을 때는 무시
			const activeElement = document.activeElement as HTMLElement;
			if (
				activeElement &&
				(activeElement.tagName === "INPUT" ||
					activeElement.tagName === "TEXTAREA" ||
					activeElement.contentEditable === "true")
			) {
				return;
			}

			// 현재 플레이어가 활성화되어 있고 currentProductId가 있을 때만 동작
			if (currentProductId) {
				event.preventDefault(); // 페이지 스크롤 방지
				onPlayHandler();
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [currentProductId, onPlayHandler]);

	// 이전 재생 상태를 추적하여 외부 토글에 의한 일시정지를 감지 - 개선된 로직
	useEffect(() => {
		// 트랙이 변경된 경우 사용자 일시정지 상태 추적을 건너뛰기
		const isTrackChanged = prevProductIdRef.current !== currentProductId;

		if (!isTrackChanged) {
			if (prevContextPlayingRef.current && !contextIsPlaying) {
				// 재생 → 일시정지 로 변경됨: 사용자가 일시정지했다고 간주
				console.log(`[MobilePlayer] User paused the track`);
				setUserPausedRef(true);
			} else if (!prevContextPlayingRef.current && contextIsPlaying) {
				// 일시정지 → 재생 로 변경됨: 사용자 일시정지 상태 해제
				console.log(`[MobilePlayer] Track resumed playing`);
				setUserPausedRef(false);
			}
		}

		prevContextPlayingRef.current = contextIsPlaying;
	}, [contextIsPlaying, currentProductId]);

	if (!currentProductId) {
		return null;
	}

	return (
		<>
			{/* 단일 ReactPlayer - 유효한 URL이 있을 때만 렌더링 */}
			{currentAudioUrl && currentAudioUrl.trim() !== "" && (
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
					onError={handleAudioError}
				/>
			)}

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
									{triggerProduct && (
										<MobilePurchaseWithCartTrigger
											product={triggerProduct}
											asChild
											onModalOpen={() => setIsFullScreen(false)}
										>
											{({ isOnCart }) => (
												<div
													className="cursor-pointer"
													onClick={(e) => e.stopPropagation()}
												>
													<MobileAddCircleSVG
														fill={isOnCart ? "var(--hbc-white)" : "var(--hbc-black)"}
														backgroundFill={isOnCart ? "#3884FF" : "var(--hbc-white)"}
														stroke={isOnCart ? "var(--hbc-black)" : "transparent"}
													/>
												</div>
											)}
										</MobilePurchaseWithCartTrigger>
									)}
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
					className={`bg-white z-[300] fixed top-0 left-0 right-0 bottom-0 flex flex-col ${
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
								{productData?.category === "BEAT" ? <MobileFullScreenPlayerBeatSVG /> : <Acapella />}
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
							{triggerProduct && (
								<MobilePurchaseWithCartTrigger
									product={triggerProduct}
									asChild
									onModalClose={handleHideFullScreen}
								>
									<button className="font-bold text-16px leading-16px text-white bg-black h-30px px-2 border-4px border-black rounded-40px flex items-center gap-2">
										<MobileAddCircleSVG
											fill="white"
											backgroundFill="transparent"
											stroke="black"
										/>
										{productData?.licenseInfo
											?.find((license: any) => (license.label ?? license.type) === "EXCLUSIVE")
											?.price?.toLocaleString() || 0}{" "}
										KRW
									</button>
								</MobilePurchaseWithCartTrigger>
							)}
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
							<MobileFullScreenPlayerRepeatSVG mode={repeatMode === "all" ? "all" : "none"} />
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
							<MobileFullScreenPlayerShuffleSVG active={isShuffleEnabled} />
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
