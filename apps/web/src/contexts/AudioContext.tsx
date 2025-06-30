"use client";

import React, { createContext, useContext, useCallback, useRef, useState, useEffect, useMemo } from "react";
import ReactPlayer from "react-player";
import { useAudioStore } from "@/stores/audio";
import { useIncreaseProductViewCountMutation } from "@/apis/product/mutations/useIncreaseProductViewCountMutation";

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

	const [state, setState] = useState<AudioState>(() => {
		const storeState = useAudioStore.getState();
		return {
			isPlaying: false,
			currentTime: 0,
			duration: 0,
			volume: storeState.volume,
			isMuted: storeState.isMuted,
			isUserSeeking: false,
		};
	});

	// zustand store에서 volume, isMuted 값을 구독합니다.
	const volume = useAudioStore((s) => s.volume);
	const isMuted = useAudioStore((s) => s.isMuted);

	const setVolume = useAudioStore((s) => s.setVolume);
	const toggleMute = useAudioStore((s) => s.toggleMute);

	// 외부에서 주입되는 콜백들을 ref에 저장하여 불필요한 리렌더를 방지
	const callbacksRef = useRef<{
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
		callbacksRef.current.onPrevious();
	}, []);

	const onNext = useCallback(() => {
		callbacksRef.current.onNext();
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

	// 볼륨 컨트롤 -> zustand store 로 위임
	const onVolumeChange = useCallback(
		(volumeValue: number) => {
			setVolume(volumeValue);
		},
		[setVolume],
	);

	const onMuteToggle = useCallback(() => {
		toggleMute();
	}, [toggleMute]);

	// store 의 volume, isMuted 변경 시 state 와 동기화하여 컨텍스트에 반영
	useEffect(() => {
		setState((prev) => ({
			...prev,
			volume,
			isMuted,
		}));
	}, [volume, isMuted]);

	// 모드 컨트롤 - 외부 콜백 호출
	const toggleRepeatMode = useCallback(() => {
		callbacksRef.current.onRepeat();
	}, []);

	const toggleShuffle = useCallback(() => {
		callbacksRef.current.onShuffle();
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
		// 재생이 종료되면 내부 상태를 "isPlaying: false" 로 업데이트하여 외부 스토어와 동기화합니다.
		setState((prev) => ({ ...prev, isPlaying: false }));
		callbacksRef.current.onEnded();
	}, []);

	// 외부 콜백 설정 함수들
	const setPreviousCallback = useCallback((callback: () => void) => {
		callbacksRef.current.onPrevious = callback;
	}, []);

	const setNextCallback = useCallback((callback: () => void) => {
		callbacksRef.current.onNext = callback;
	}, []);

	const setShuffleCallback = useCallback((callback: () => void) => {
		callbacksRef.current.onShuffle = callback;
	}, []);

	const setRepeatCallback = useCallback((callback: () => void) => {
		callbacksRef.current.onRepeat = callback;
	}, []);

	const setEndedCallback = useCallback((callback: () => void) => {
		callbacksRef.current.onEnded = callback;
	}, []);

	// 추가: 30초 이상 재생 시 조회수 증가 로직에 사용할 커스텀 훅 및 레퍼런스들
	const { mutate: increaseViewCount } = useIncreaseProductViewCountMutation();
	const lastProductIdRef = useRef<number | null>(null);
	const listenedSecondsRef = useRef<number>(0);
	const prevTimeRef = useRef<number>(0);

	// 30초 이상 연속 재생(시킹 제외) 시 조회수 증가 처리
	useEffect(() => {
		const currentProductId = useAudioStore.getState().productId;

		// 상품이 변경되면 카운터 초기화
		if (currentProductId !== lastProductIdRef.current) {
			lastProductIdRef.current = currentProductId;
			listenedSecondsRef.current = 0;
			prevTimeRef.current = state.currentTime;
			return; // 초기화 시 즉시 종료하여 불필요한 로직 수행 방지
		}

		// 재생 중이 아니거나, 사용자가 시킹 중이면 카운팅하지 않음
		if (!state.isPlaying || state.isUserSeeking || currentProductId == null) {
			prevTimeRef.current = state.currentTime;
			return;
		}

		// 이전 측정 시점과의 차이를 계산하여 실제 재생 시간을 누적 (시킹으로 인한 큰 점프는 무시)
		const delta = state.currentTime - prevTimeRef.current;
		if (delta > 0 && delta < 5) {
			listenedSecondsRef.current += delta;
			if (listenedSecondsRef.current >= 30) {
				// 이미 호출했는지 여부를 listenedSecondsRef로 판단 (-1 로 마킹)
				increaseViewCount(currentProductId);
				listenedSecondsRef.current = -Infinity; // 중복 호출 방지
			}
		}

		prevTimeRef.current = state.currentTime;
	}, [state.currentTime, state.isPlaying, state.isUserSeeking, increaseViewCount]);

	// Memoize context value to avoid unnecessary re-renders in consumers
	const contextValue: AudioContextValue = useMemo(
		() => ({
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
		}),
		[
			state,
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
		],
	);

	return <AudioContext.Provider value={contextValue}>{children}</AudioContext.Provider>;
};

// Hook helpers to access slices of the state
export const useIsPlaying = () => useAudioContext().isPlaying;
export const useCurrentTime = () => useAudioContext().currentTime;
export const useDuration = () => useAudioContext().duration;
export const useVolume = () => useAudioContext().volume;
export const useIsMuted = () => useAudioContext().isMuted;
export const useIsUserSeeking = () => useAudioContext().isUserSeeking;
