"use client";

import React, { createContext, useContext, useCallback, useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";

interface AudioState {
	isPlaying: boolean;
	currentTime: number;
	duration: number;
	volume: number;
	isMuted: boolean;
	isUserSeeking: boolean;
}

interface AudioContextValue extends AudioState {
	playerRef: React.RefObject<ReactPlayer | null>;
	// 플레이어 컨트롤
	togglePlay: () => void;
	stop: () => void;
	autoPlay: () => void;
	// 탐색 컨트롤 - 외부에서 제공되는 콜백
	onPrevious: () => void;
	onNext: () => void;
	onSeek: (seconds: number) => void;
	onSeekStart: () => void;
	onSeekEnd: () => void;
	// 볼륨 컨트롤
	onVolumeChange: (volume: number) => void;
	onMuteToggle: () => void;
	// 모드 컨트롤 - 외부에서 제공되는 콜백
	toggleRepeatMode: () => void;
	toggleShuffle: () => void;
	// ReactPlayer 이벤트 핸들러
	onProgress: (playedSeconds: number) => void;
	onDuration: (duration: number) => void;
	onEnded: () => void;
	// 외부 콜백 설정
	setPreviousCallback: (callback: () => void) => void;
	setNextCallback: (callback: () => void) => void;
	setShuffleCallback: (callback: () => void) => void;
	setRepeatCallback: (callback: () => void) => void;
	setEndedCallback: (callback: () => void) => void;
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
		isUserSeeking: false, // 사용자가 시크바를 조작 중인지 여부
	});

	// 외부 콜백 함수들 저장
	const [callbacks, setCallbacks] = useState<{
		onPrevious: () => void;
		onNext: () => void;
		onShuffle: () => void;
		onRepeat: () => void;
		onEnded: () => void;
	}>({
		onPrevious: () => console.log("Previous track"),
		onNext: () => console.log("Next track"),
		onShuffle: () => console.log("Toggle shuffle"),
		onRepeat: () => console.log("Toggle repeat"),
		onEnded: () => console.log("Track ended"),
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

	// 탐색 컨트롤 - 외부 콜백 호출
	const onPrevious = useCallback(() => {
		callbacks.onPrevious();
	}, [callbacks.onPrevious]);

	const onNext = useCallback(() => {
		callbacks.onNext();
	}, [callbacks.onNext]);

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

	// 모드 컨트롤 - 외부 콜백 호출
	const toggleRepeatMode = useCallback(() => {
		callbacks.onRepeat();
	}, [callbacks.onRepeat]);

	const toggleShuffle = useCallback(() => {
		callbacks.onShuffle();
	}, [callbacks.onShuffle]);

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
		callbacks.onEnded();
	}, [callbacks.onEnded]);

	// 외부 콜백 설정 함수들
	const setPreviousCallback = useCallback((callback: () => void) => {
		setCallbacks((prev) => ({ ...prev, onPrevious: callback }));
	}, []);

	const setNextCallback = useCallback((callback: () => void) => {
		setCallbacks((prev) => ({ ...prev, onNext: callback }));
	}, []);

	const setShuffleCallback = useCallback((callback: () => void) => {
		setCallbacks((prev) => ({ ...prev, onShuffle: callback }));
	}, []);

	const setRepeatCallback = useCallback((callback: () => void) => {
		setCallbacks((prev) => ({ ...prev, onRepeat: callback }));
	}, []);

	const setEndedCallback = useCallback((callback: () => void) => {
		setCallbacks((prev) => ({ ...prev, onEnded: callback }));
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
		setPreviousCallback,
		setNextCallback,
		setShuffleCallback,
		setRepeatCallback,
		setEndedCallback,
	};

	return <AudioContext.Provider value={contextValue}>{children}</AudioContext.Provider>;
};
