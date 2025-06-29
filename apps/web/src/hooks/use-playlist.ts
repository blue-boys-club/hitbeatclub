import { useCallback, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { usePlaylistStore } from "@/stores/playlist";
import { useAudioStore } from "@/stores/audio";
import { useAuthStore } from "@/stores/auth";
import { useUpdatePlaylistMutation } from "@/apis/playlist/mutations/useUpdatePlaylistMutation";
import {
	userPlaylistQueryOptions,
	playlistAutoQueryOptions,
	playlistManualQueryOptions,
} from "@/apis/playlist/query/playlist.query-options";
import { useToast } from "@/hooks/use-toast";
import { PlaylistAutoRequest, PlaylistManualRequest } from "@hitbeatclub/shared-types";
import { useLayoutStore } from "@/stores/layout";

/**
 * 플레이리스트 관리 훅
 * - 인증 상태에 따른 플레이리스트 초기화
 * - 서버와의 동기화 (200ms 디바운스)
 * - 트랙 변경 및 재생 불가 트랙 처리
 */
export const usePlaylist = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// 인증 상태
	const { user } = useAuthStore(useShallow((state) => ({ user: state.user })));
	const isLoggedIn = Boolean(user?.userId);

	// 플레이리스트 상태
	const {
		trackIds,
		currentIndex,
		syncStatus,
		isShuffleEnabled,
		repeatMode,
		setCurrentTrackIds,
		setCurrentIndex,
		setSyncStatus,
		setLastSyncTime,
		toggleShuffle,
		toggleRepeatMode,
		setRepeatMode,
		getCurrentPlayableTrackId,
		getNextPlayableIndex,
		getPreviousPlayableIndex,
		addUnplayableTrack,
		enforceMaxLength,
		init: initPlaylist,
	} = usePlaylistStore(
		useShallow((state) => ({
			trackIds: state.trackIds,
			currentIndex: state.currentIndex,
			syncStatus: state.syncStatus,
			isShuffleEnabled: state.isShuffleEnabled,
			repeatMode: state.repeatMode,
			setCurrentTrackIds: state.setCurrentTrackIds,
			setCurrentIndex: state.setCurrentIndex,
			setSyncStatus: state.setSyncStatus,
			setLastSyncTime: state.setLastSyncTime,
			toggleShuffle: state.toggleShuffle,
			toggleRepeatMode: state.toggleRepeatMode,
			setRepeatMode: state.setRepeatMode,
			getCurrentPlayableTrackId: state.getCurrentPlayableTrackId,
			getNextPlayableIndex: state.getNextPlayableIndex,
			getPreviousPlayableIndex: state.getPreviousPlayableIndex,
			addUnplayableTrack: state.addUnplayableTrack,
			enforceMaxLength: state.enforceMaxLength,
			init: state.init,
		})),
	);

	// 오디오 상태
	const { setProductId } = useAudioStore(useShallow((state) => ({ setProductId: state.setProductId })));

	// Layout store to synchronize currently playing track id
	const { setPlayer } = useLayoutStore(
		useShallow((state) => ({
			setPlayer: state.setPlayer,
		})),
	);

	// 서버 동기화 뮤테이션
	const updatePlaylistMutation = useUpdatePlaylistMutation();

	// 로그인 사용자 플레이리스트 조회
	const { data: userPlaylist } = useQuery({
		...userPlaylistQueryOptions,
		enabled: isLoggedIn,
		retry: false,
	});

	/**
	 * 200ms 디바운스를 적용한 서버 동기화
	 */
	const debouncedSync = useCallback(() => {
		if (!isLoggedIn) return;

		// 기존 타이머 취소
		if (syncTimeoutRef.current) {
			clearTimeout(syncTimeoutRef.current);
		}

		// 새 타이머 설정
		syncTimeoutRef.current = setTimeout(() => {
			setSyncStatus("syncing");

			// 항상 최신 상태를 사용하기 위해 스토어에서 직접 가져옴
			const { trackIds: latestTrackIds, currentIndex: latestCurrentIndex } = usePlaylistStore.getState();
			if (process.env.NODE_ENV !== "production") {
				console.debug("[Playlist] Debounced Sync", {
					trackIds: latestTrackIds,
					currentIndex: latestCurrentIndex,
				});
			}

			updatePlaylistMutation.mutate(
				{ trackIds: latestTrackIds, currentIndex: latestCurrentIndex },
				{
					onSuccess: () => {
						setSyncStatus("idle");
						setLastSyncTime(Date.now());
					},
					onError: () => {
						setSyncStatus("error");
						toast({
							description: "플레이리스트 동기화에 실패했습니다.",
							variant: "destructive",
						});
					},
				},
			);
		}, 200);
	}, [isLoggedIn, setSyncStatus, setLastSyncTime, updatePlaylistMutation, toast]);

	/**
	 * 플레이리스트 초기화
	 * - 로그인: 서버에서 플레이리스트 로드
	 * - 비로그인: localStorage 데이터 유지
	 */
	const initializePlaylist = useCallback(() => {
		if (isLoggedIn && userPlaylist) {
			// 서버 데이터로 덮어쓰기
			setCurrentTrackIds(userPlaylist.data.trackIds || [], userPlaylist.data.currentIndex || 0);
		}
		// 비로그인 상태에서는 localStorage에서 자동으로 복원됨
	}, [isLoggedIn, userPlaylist, setCurrentTrackIds]);

	/**
	 * Guest → Login 시 게스트 플레이리스트로 서버 덮어쓰기
	 */
	const overwriteServerWithGuestPlaylist = useCallback(() => {
		if (isLoggedIn && trackIds.length > 0) {
			updatePlaylistMutation.mutate(
				{ trackIds, currentIndex },
				{
					onSuccess: () => {
						toast({
							description: "기존 플레이리스트가 저장되었습니다.",
						});
					},
					onError: () => {
						toast({
							description: "플레이리스트 저장에 실패했습니다.",
							variant: "destructive",
						});
					},
				},
			);
		}
	}, [isLoggedIn, trackIds, currentIndex, updatePlaylistMutation, toast]);

	/**
	 * 자동 플레이리스트 생성
	 */
	const createAutoPlaylist = useCallback(
		async (request: PlaylistAutoRequest) => {
			try {
				const data = await queryClient.fetchQuery(playlistAutoQueryOptions(request));
				setCurrentTrackIds(data.data.trackIds || [], 0);
				enforceMaxLength();
				if (process.env.NODE_ENV !== "production") {
					console.debug("[Playlist] Auto playlist created", {
						request,
						trackIds: data.data.trackIds,
					});
				}

				if (isLoggedIn) {
					debouncedSync();
				}

				return data;
			} catch (error) {
				toast({
					description: "플레이리스트 생성에 실패했습니다.",
					variant: "destructive",
				});
				throw error;
			}
		},
		[queryClient, setCurrentTrackIds, enforceMaxLength, isLoggedIn, debouncedSync, toast],
	);

	/**
	 * 수동 플레이리스트 생성
	 */
	const createManualPlaylist = useCallback(
		async (request: PlaylistManualRequest) => {
			try {
				const data = await queryClient.fetchQuery(playlistManualQueryOptions(request));
				setCurrentTrackIds(data.data.trackIds || [], 0);
				enforceMaxLength();

				if (isLoggedIn) {
					debouncedSync();
				}

				return data;
			} catch (error) {
				toast({
					description: "플레이리스트 생성에 실패했습니다.",
					variant: "destructive",
				});
				throw error;
			}
		},
		[queryClient, setCurrentTrackIds, enforceMaxLength, isLoggedIn, debouncedSync, toast],
	);

	/**
	 * 다음 트랙으로 이동
	 */
	const playNextTrack = useCallback(() => {
		const nextIndex = getNextPlayableIndex();
		if (nextIndex !== null) {
			setCurrentIndex(nextIndex);
			const nextTrackId = trackIds[nextIndex];
			if (nextTrackId) {
				setProductId(nextTrackId);
				setPlayer({ trackId: nextTrackId });
			}

			if (isLoggedIn) {
				debouncedSync();
			}
			return true;
		}
		return false;
	}, [getNextPlayableIndex, setCurrentIndex, trackIds, setProductId, isLoggedIn, debouncedSync, setPlayer]);

	/**
	 * 이전 트랙으로 이동
	 */
	const playPreviousTrack = useCallback(() => {
		const previousIndex = getPreviousPlayableIndex();
		if (previousIndex !== null) {
			setCurrentIndex(previousIndex);
			const previousTrackId = trackIds[previousIndex];
			if (previousTrackId) {
				setProductId(previousTrackId);
				setPlayer({ trackId: previousTrackId });
			}

			if (isLoggedIn) {
				debouncedSync();
			}
			return true;
		}
		return false;
	}, [getPreviousPlayableIndex, setCurrentIndex, trackIds, setProductId, isLoggedIn, debouncedSync, setPlayer]);

	/**
	 * 특정 인덱스로 이동
	 */
	const playTrackAtIndex = useCallback(
		(index: number) => {
			if (index >= 0 && index < trackIds.length) {
				const trackId = trackIds[index];
				setCurrentIndex(index);

				if (trackId) {
					setProductId(trackId);
					setPlayer({ trackId });
				}

				if (isLoggedIn) {
					debouncedSync();
				}
				return true;
			}
			return false;
		},
		[trackIds, setCurrentIndex, setProductId, isLoggedIn, debouncedSync, setPlayer],
	);

	/**
	 * 재생 불가 트랙 처리 및 자동 건너뛰기
	 */
	const handleUnplayableTrack = useCallback(
		(trackId: number) => {
			addUnplayableTrack(trackId);

			toast({
				description: "재생할 수 없는 곡을 건너뛰었습니다.",
			});

			// 자동으로 다음 재생 가능한 트랙으로 이동
			const nextIndex = getNextPlayableIndex();
			if (nextIndex !== null) {
				setCurrentIndex(nextIndex);
				const nextTrackId = trackIds[nextIndex];
				if (nextTrackId) {
					setProductId(nextTrackId);
					setPlayer({ trackId: nextTrackId });
				}

				if (isLoggedIn) {
					debouncedSync();
				}
			}
		},
		[
			addUnplayableTrack,
			toast,
			getNextPlayableIndex,
			setCurrentIndex,
			trackIds,
			setProductId,
			isLoggedIn,
			debouncedSync,
			setPlayer,
		],
	);

	/**
	 * 플레이리스트에 트랙 추가
	 */
	const addTrackToPlaylist = useCallback(
		(trackId: number) => {
			const newTrackIds = [...trackIds, trackId];
			setCurrentTrackIds(newTrackIds, currentIndex);
			enforceMaxLength();

			if (isLoggedIn) {
				debouncedSync();
			}
		},
		[trackIds, currentIndex, setCurrentTrackIds, enforceMaxLength, isLoggedIn, debouncedSync],
	);

	/**
	 * 현재 재생 가능한 트랙 ID
	 */
	const currentPlayableTrackId = getCurrentPlayableTrackId();

	// 인증 상태 변경 시 플레이리스트 초기화
	useEffect(() => {
		initializePlaylist();
	}, [initializePlaylist]);

	// 컴포넌트 언마운트 시 타이머 정리
	useEffect(() => {
		return () => {
			if (syncTimeoutRef.current) {
				clearTimeout(syncTimeoutRef.current);
			}
		};
	}, []);

	/**
	 * 자동 플레이리스트 생성 후 지정 인덱스 재생 (유틸)
	 */
	const createAutoPlaylistAndPlay = useCallback(
		async (request: PlaylistAutoRequest, index = 0) => {
			const data = await createAutoPlaylist(request);
			// 플레이리스트가 저장된 직후 상태가 이미 업데이트되어 있으므로 바로 호출 가능
			playTrackAtIndex(index);
			if (process.env.NODE_ENV !== "production") {
				console.debug("[Playlist] Auto playlist created & playing", { index, trackIds: data.data.trackIds });
			}
			return data;
		},
		[createAutoPlaylist, playTrackAtIndex],
	);

	const createManualPlaylistAndPlay = useCallback(
		async (request: PlaylistManualRequest, index = 0) => {
			const data = await createManualPlaylist(request);
			playTrackAtIndex(index);
			if (process.env.NODE_ENV !== "production") {
				console.debug("[Playlist] Manual playlist created & playing", { index, trackIds: data.data.trackIds });
			}
			return data;
		},
		[createManualPlaylist, playTrackAtIndex],
	);

	return {
		// 상태
		trackIds,
		currentIndex,
		syncStatus,
		isShuffleEnabled,
		repeatMode,
		currentPlayableTrackId,
		isLoggedIn,
		enforceMaxLength,
		createAutoPlaylistAndPlay,
		createManualPlaylistAndPlay,
		// 액션
		initializePlaylist,
		overwriteServerWithGuestPlaylist,
		createAutoPlaylist,
		createManualPlaylist,
		playNextTrack,
		playPreviousTrack,
		playTrackAtIndex,
		handleUnplayableTrack,
		addTrackToPlaylist,
		toggleShuffle,
		toggleRepeatMode,
		setRepeatMode,

		// 원시 액션 (필요시)
		setCurrentTrackIds,
		setCurrentIndex,
		debouncedSync,
	};
};
