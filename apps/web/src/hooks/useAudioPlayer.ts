import { useCallback, useRef, useState } from "react";
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

	const togglePlay = () => {
		setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
	};

	const toggleRepeatMode = () => {
		setState((prev) => ({
			...prev,
			repeatMode: prev.repeatMode === "none" ? "one" : prev.repeatMode === "one" ? "all" : "none",
		}));
	};

	const toggleShuffle = () => {
		setState((prev) => ({ ...prev, shuffle: !prev.shuffle }));
	};

	// 첫 곡이 아니면 이전 곡 이동
	const onPrevious = () => {
		if (state.currentIndex > 0) {
			setState((prev) => ({ ...prev, currentIndex: prev.currentIndex - 1 }));
		}
	};

	// 마지막 곡이 아니면 다음 곡 이동
	const onNext = () => {
		if (state.currentIndex < state.playlist.length - 1) {
			setState((prev) => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
		}
	};

	// 특정 시간으로 이동
	const onSeek = useCallback((seconds: number) => {
		if (playerRef.current) {
			playerRef.current.seekTo(seconds, "seconds");
		}
	}, []);

	// 현재 진행 중인 재생 시간
	const onProgress = (playedSeconds: number) => {
		setState((prev) => ({ ...prev, currentTime: playedSeconds }));
	};

	// 곡 길이
	const onDuration = (duration: number) => {
		setState((prev) => ({ ...prev, duration: duration }));
	};

	// 재생 종료 시 처리
	const onEnded = () => {
		if (!playerRef.current) return;

		if (state.repeatMode === "one") {
			playerRef.current.seekTo(0);
		} else if (state.repeatMode === "all") {
			const nextIndex = (state.currentIndex + 1) % state.playlist.length;
			setState((prev) => ({ ...prev, currentIndex: nextIndex }));
		} else {
			if (state.currentIndex < state.playlist.length - 1) {
				setState((prev) => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
			} else {
				setState((prev) => ({ ...prev, isPlaying: false }));
			}
		}
	};

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

	return {
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
	};
};
