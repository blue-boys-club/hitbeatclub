"use client";

import React, { createContext, useContext, useCallback, useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";

interface AudioState {
	isPlaying: boolean;
	currentTime: number;
	duration: number;
	volume: number;
	isMuted: boolean;
	repeatMode: "none" | "one" | "all";
	shuffle: boolean;
	isUserSeeking: boolean;
}

interface AudioContextValue extends AudioState {
	playerRef: React.RefObject<ReactPlayer | null>;
	// 플레이어 컨트롤
	togglePlay: () => void;
	stop: () => void;
	autoPlay: () => void;
	// 탐색 컨트롤
	onPrevious: () => void;
	onNext: () => void;
	onSeek: (seconds: number) => void;
	onSeekStart: () => void;
	onSeekEnd: () => void;
	// 볼륨 컨트롤
	onVolumeChange: (volume: number) => void;
	onMuteToggle: () => void;
	// 모드 컨트롤
	toggleRepeatMode: () => void;
	toggleShuffle: () => void;
	// ReactPlayer 이벤트 핸들러
	onProgress: (playedSeconds: number) => void;
	onDuration: (duration: number) => void;
	onEnded: () => void;
}

const AudioContext = createContext<AudioContextValue | null>(null);

export const useAudioContext = () => {
	const context = useContext(AudioContext);
	if (!context) {
		throw new Error("useAudioContext must be used within AudioProvider");
	}
	return context;
};

interface AudioProviderProps {
	children: React.ReactNode;
}

export const AudioProvider = ({ children }: AudioProviderProps) => {
	const playerRef = useRef<ReactPlayer>(null);

	const [state, setState] = useState<AudioState>({
		isPlaying: false,
		currentTime: 0,
		duration: 0,
		volume: 0.5,
		isMuted: false,
		repeatMode: "none",
		shuffle: false,
		isUserSeeking: false, // 사용자가 시크바를 조작 중인지 여부
	});

	// 1초마다 진행 시간 업데이트 (사용자가 시크바 조작 중이 아닐 때만)
	useEffect(() => {
		let interval: NodeJS.Timeout;

		if (state.isPlaying && !state.isUserSeeking) {
			interval = setInterval(() => {
				if (playerRef.current) {
					const currentTime = playerRef.current.getCurrentTime();
					setState((prev) => ({ ...prev, currentTime: Math.floor(currentTime) }));
				}
			}, 1000);
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [state.isPlaying, state.isUserSeeking]);

	// 플레이어 컨트롤
	const togglePlay = useCallback(() => {
		setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
	}, []);

	const stop = useCallback(() => {
		if (playerRef.current) {
			playerRef.current.seekTo(0);
			setState((prev) => ({ ...prev, isPlaying: false, currentTime: 0 }));
		}
	}, []);

	const autoPlay = useCallback(() => {
		if (playerRef.current) {
			playerRef.current.seekTo(0);
			setState((prev) => ({ ...prev, isPlaying: true, currentTime: 0 }));
		}
	}, []);

	// 탐색 컨트롤 - 플레이리스트 연동을 위한 콜백 함수들
	const onPrevious = useCallback(() => {
		// FooterPlayer에서 playNextTrack 로직 사용
		// 실제 구현은 AudioProvider를 사용하는 상위 컴포넌트에서 처리
		console.log("Previous track");
	}, []);

	const onNext = useCallback(() => {
		// FooterPlayer에서 playNextTrack 로직 사용
		// 실제 구현은 AudioProvider를 사용하는 상위 컴포넌트에서 처리
		console.log("Next track");
	}, []);

	const onSeek = useCallback((seconds: number) => {
		if (playerRef.current) {
			playerRef.current.seekTo(seconds, "seconds");
			setState((prev) => ({ ...prev, currentTime: seconds }));
		}
	}, []);

	const onSeekStart = useCallback(() => {
		setState((prev) => ({ ...prev, isUserSeeking: true }));
	}, []);

	const onSeekEnd = useCallback(() => {
		setState((prev) => ({ ...prev, isUserSeeking: false }));
	}, []);

	// 볼륨 컨트롤
	const onVolumeChange = useCallback((volume: number) => {
		setState((prev) => ({
			...prev,
			volume,
			isMuted: volume === 0,
		}));
	}, []);

	const onMuteToggle = useCallback(() => {
		setState((prev) => {
			if (prev.isMuted) {
				return { ...prev, isMuted: false, volume: prev.volume || 0.5 };
			} else {
				return { ...prev, isMuted: true, volume: 0 };
			}
		});
	}, []);

	// 모드 컨트롤
	const toggleRepeatMode = useCallback(() => {
		setState((prev) => ({
			...prev,
			repeatMode: prev.repeatMode === "none" ? "one" : prev.repeatMode === "one" ? "all" : "none",
		}));
	}, []);

	const toggleShuffle = useCallback(() => {
		setState((prev) => ({ ...prev, shuffle: !prev.shuffle }));
	}, []);

	// ReactPlayer 이벤트 핸들러
	const onProgress = useCallback((playedSeconds: number) => {
		// 사용자가 시크바를 조작 중이 아닐 때만 업데이트
		setState((prev) => {
			if (!prev.isUserSeeking) {
				return { ...prev, currentTime: Math.floor(playedSeconds) };
			}
			return prev;
		});
	}, []);

	const onDuration = useCallback((duration: number) => {
		setState((prev) => ({ ...prev, duration: Math.floor(duration) }));
	}, []);

	const onEnded = useCallback(() => {
		setState((prev) => {
			if (prev.repeatMode === "one") {
				// 한 곡 반복
				if (playerRef.current) {
					playerRef.current.seekTo(0);
				}
				return { ...prev, currentTime: 0 };
			} else {
				// TODO: 플레이리스트 다음 곡 재생 or 정지
				return { ...prev, isPlaying: false };
			}
		});
	}, []);

	const contextValue: AudioContextValue = {
		...state,
		playerRef,
		togglePlay,
		stop,
		autoPlay,
		onPrevious,
		onNext,
		onSeek,
		onSeekStart,
		onSeekEnd,
		onVolumeChange,
		onMuteToggle,
		toggleRepeatMode,
		toggleShuffle,
		onProgress,
		onDuration,
		onEnded,
	};

	return <AudioContext.Provider value={contextValue}>{children}</AudioContext.Provider>;
};
