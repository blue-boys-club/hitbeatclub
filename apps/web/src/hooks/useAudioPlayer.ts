import { useCallback, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";

interface AudioPlayerState {
	isPlaying: boolean;
	currentTime: number;
	duration: number;
	volume: {
		currentVolume: number;
		prevVolume: number;
	};
	isMuted: boolean;
	repeatMode: "none" | "one" | "all";
	shuffle: boolean;
	currentIndex: number;
	playlist: any[]; // TODO: Define proper type for playlist items
}

export const useAudioPlayer = () => {
	const playerRef = useRef<ReactPlayer>(null);

	const [state, setState] = useState<AudioPlayerState>({
		isPlaying: false,
		currentTime: 0,
		duration: 0,
		volume: {
			currentVolume: 0.5,
			prevVolume: 0.5,
		},
		isMuted: false,
		repeatMode: "none",
		shuffle: false,
		currentIndex: 0,
		playlist: [],
	});

	const stop = useCallback(() => {
		if (playerRef.current) {
			playerRef.current.seekTo(0);
			setState((prev) => ({ ...prev, isPlaying: false, currentTime: 0 }));
		}
	}, []);

	const autoPlay = useCallback(() => {
		if (playerRef.current) {
			// 이전 재생 정리
			playerRef.current.seekTo(0);
			setState((prev) => ({ ...prev, isPlaying: false, currentTime: 0 }));
			// 새로운 재생 시작
			setState((prev) => ({ ...prev, isPlaying: true }));
			playerRef.current.seekTo(0);
		}
	}, []);

	const togglePlay = useCallback(() => {
		setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
	}, []);

	const toggleRepeatMode = useCallback(() => {
		setState((prev) => ({
			...prev,
			repeatMode: prev.repeatMode === "none" ? "one" : prev.repeatMode === "one" ? "all" : "none",
		}));
	}, []);

	const toggleShuffle = useCallback(() => {
		setState((prev) => ({ ...prev, shuffle: !prev.shuffle }));
	}, []);

	// 첫 곡이 아니면 이전 곡 이동
	const onPrevious = useCallback(() => {
		setState((prev) => {
			if (prev.currentIndex > 0) {
				return { ...prev, currentIndex: prev.currentIndex - 1 };
			}
			return prev;
		});
	}, []);

	// 마지막 곡이 아니면 다음 곡 이동
	const onNext = useCallback(() => {
		setState((prev) => {
			if (prev.currentIndex < prev.playlist.length - 1) {
				return { ...prev, currentIndex: prev.currentIndex + 1 };
			}
			return prev;
		});
	}, []);

	// 특정 시간으로 이동
	const onSeek = useCallback((seconds: number) => {
		if (playerRef.current) {
			playerRef.current.seekTo(seconds, "seconds");
		}
	}, []);

	// 현재 진행 중인 재생 시간
	const onProgress = useCallback((playedSeconds: number) => {
		setState((prev) => ({ ...prev, currentTime: Math.floor(playedSeconds) }));
	}, []);

	// 곡 길이
	const onDuration = useCallback((duration: number) => {
		setState((prev) => ({ ...prev, duration: Math.floor(duration) }));
	}, []);

	// 재생 종료 시 처리
	const onEnded = useCallback(() => {
		if (!playerRef.current) return;

		setState((prev) => {
			if (prev.repeatMode === "one") {
				playerRef.current?.seekTo(0);
				return prev;
			} else if (prev.repeatMode === "all") {
				const nextIndex = (prev.currentIndex + 1) % prev.playlist.length;
				return { ...prev, currentIndex: nextIndex };
			} else {
				if (prev.currentIndex < prev.playlist.length - 1) {
					return { ...prev, currentIndex: prev.currentIndex + 1 };
				} else {
					return { ...prev, isPlaying: false };
				}
			}
		});
	}, []);

	// 볼륨 변경
	const onVolumeChange = useCallback((value: number[]) => {
		const newVolume = value[0] ?? 0;
		setState((prev) => ({
			...prev,
			volume: {
				currentVolume: newVolume,
				prevVolume: newVolume,
			},
			isMuted: newVolume === 0,
		}));
	}, []);

	// 음소거 토글
	const onMuteToggle = useCallback(() => {
		setState((prev) => {
			if (prev.volume.currentVolume === 0 && prev.volume.prevVolume === 0) {
				return {
					...prev,
					isMuted: false,
					volume: {
						...prev.volume,
						currentVolume: 0.1,
					},
				};
			}

			if (prev.isMuted) {
				return {
					...prev,
					isMuted: false,
					volume: {
						...prev.volume,
						currentVolume: prev.volume.prevVolume,
					},
				};
			} else {
				return {
					...prev,
					isMuted: true,
					volume: {
						...prev.volume,
						currentVolume: 0,
					},
				};
			}
		});
	}, []);

	// useMemo를 사용하여 객체 참조 안정화
	return useMemo(
		() => ({
			playerRef,
			...state,
			togglePlay,
			onPrevious,
			onNext,
			onProgress,
			onDuration,
			onEnded,
			onVolumeChange,
			onMuteToggle,
			toggleRepeatMode,
			toggleShuffle,
			onSeek,
			autoPlay,
			stop,
		}),
		[
			state,
			togglePlay,
			onPrevious,
			onNext,
			onProgress,
			onDuration,
			onEnded,
			onVolumeChange,
			onMuteToggle,
			toggleRepeatMode,
			toggleShuffle,
			onSeek,
			autoPlay,
			stop,
		],
	);
};
