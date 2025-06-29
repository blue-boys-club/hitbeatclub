"use client";

import {
	AudioBarPlay,
	NextTrack,
	PrevTrack,
	RepeatAll,
	RepeatOne,
	RepeatOff,
	ShuffleOff,
	ShuffleOn,
	AudioBarPause,
	VolumeThumb,
} from "@/assets/svgs";
import { ReactPlayer } from "./ReactPlayer";
import { useAudioContext } from "@/contexts/AudioContext";
import { usePlaylist } from "@/hooks/use-playlist";
// import * as Slider from "@radix-ui/react-slider";
import { Slider } from "@base-ui-components/react/slider";
import { useCallback, useState, useEffect, useRef } from "react";

interface AudioPlayerProps {
	url: string;
}

export const AudioPlayer = ({ url }: AudioPlayerProps) => {
	const {
		playerRef,
		togglePlay,
		onPrevious,
		onNext,
		onProgress,
		onDuration,
		onEnded,
		toggleRepeatMode,
		toggleShuffle,
		onSeek,
		onSeekStart,
		onSeekEnd,
		isPlaying,
		currentTime,
		duration,
		volume,
	} = useAudioContext();

	// 개별 상태 구독
	// const isPlaying = useIsPlaying();
	// const currentTime = useCurrentTime();
	// const duration = useDuration();
	// const volume = useVolume();
	// const isUserSeeking = useIsUserSeeking();

	// 플레이리스트에서 셔플/반복 상태 가져오기
	const { isShuffleEnabled, repeatMode } = usePlaylist();

	// 슬라이더 드래그 중 임시 값 저장
	// const [tempSeekValue, setTempSeekValue] = useState<number>(0);

	// 이전 currentTime 값을 추적하여 불필요한 업데이트 방지
	const prevCurrentTimeRef = useRef<number>(0);

	// 사용자가 시크바를 조작하지 않을 때만 currentTime과 동기화
	// useEffect(() => {
	// 	if (!isUserSeeking && prevCurrentTimeRef.current !== currentTime) {
	// 		setTempSeekValue(currentTime);
	// 		prevCurrentTimeRef.current = currentTime;
	// 	}
	// }, [currentTime, isUserSeeking]);

	// 슬라이더 드래그 시작
	const handleSeekStart = useCallback(() => {
		onSeekStart();
		// 현재 재생 시간을 기준으로 임시 값 설정
		if (playerRef.current) {
			const current = playerRef.current.getCurrentTime();
			// setTempSeekValue(Math.floor(current));
			onSeek(Math.floor(current));
		}
	}, [onSeekStart, playerRef]);

	// 슬라이더 값 변경 중 (드래그 중)
	const handleSeekChange = useCallback((value: number[]) => {
		const newTime = value[0] ?? 0;
		// setTempSeekValue(newTime);
		onSeek(newTime);
	}, []);

	// 슬라이더 드래그 완료
	const handleSeekEnd = useCallback(
		(value: number[]) => {
			const newTime = value[0] ?? 0;
			onSeek(newTime);
			// setTempSeekValue(newTime);
			onSeekEnd();
		},
		[onSeek, onSeekEnd],
	);

	const getRepeatIcon = () => {
		switch (repeatMode) {
			case "one":
				return <RepeatOne />;
			case "all":
				return <RepeatAll />;
			default:
				return <RepeatOff />;
		}
	};

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
	};

	useEffect(() => {
		console.log("currentTime", currentTime);
	}, [currentTime]);

	return (
		<div className="flex flex-col items-center gap-1.5">
			{/* 재생 컨트롤 */}
			<div className="inline-flex items-center justify-center gap-4">
				<button
					className="flex items-center justify-center gap-2 cursor-pointer"
					onClick={toggleRepeatMode}
				>
					{getRepeatIcon()}
				</button>

				<button
					className="w-5 h-5 rounded-md hover:bg-[#DFDFDF99] cursor-pointer"
					onClick={onPrevious}
				>
					<PrevTrack />
				</button>

				<button
					className="cursor-pointer"
					onClick={togglePlay}
				>
					{isPlaying ? <AudioBarPause /> : <AudioBarPlay />}
				</button>

				<button
					className="w-5 h-5 rounded-md hover:bg-[#DFDFDF99] cursor-pointer"
					onClick={onNext}
				>
					<NextTrack />
				</button>

				<button
					className="cursor-pointer"
					onClick={toggleShuffle}
				>
					{isShuffleEnabled ? <ShuffleOn /> : <ShuffleOff />}
				</button>
			</div>
			<ReactPlayer
				ref={playerRef}
				url={url}
				playing={isPlaying}
				controls={false}
				width="0"
				height="0"
				value={[currentTime]}
				volume={volume}
				onEnded={onEnded}
				onProgress={({ playedSeconds }) => onProgress(playedSeconds)}
				onDuration={(duration) => onDuration(duration)}
			/>

			{/* 재생 시간 및 프로그레스 바 */}
			<div className="inline-flex items-center justify-center gap-4">
				<div className="text-black text-base font-bold font-suit leading-3">{formatTime(currentTime)}</div>
				<Slider.Root
					// value={[tempSeekValue]}
					value={[currentTime]}
					min={0}
					max={duration}
					step={1}
					onValueChange={handleSeekChange}
					onValueCommitted={handleSeekEnd}
					onPointerDown={handleSeekStart}
				>
					<Slider.Control className="relative flex h-5 w-[500px] items-center cursor-pointer group">
						<Slider.Track className="relative h-[6px] grow">
							<div className="absolute h-[2px] w-full top-1/2 -translate-y-1/2 bg-black" />
							{/* <Slider.Range className="absolute h-[6px] top-1/2 -translate-y-1/2 bg-black" /> */}
							<Slider.Indicator className="relative h-[6px] w-full top-1/2 -translate-y-1/2 bg-black" />
							<Slider.Thumb
								className="transition-opacity duration-200 opacity-0 group-hover:opacity-100"
								aria-label="Time"
							>
								<VolumeThumb />
							</Slider.Thumb>
						</Slider.Track>
					</Slider.Control>
				</Slider.Root>
				<div className="text-black text-base font-bold font-suit leading-3">{formatTime(duration)}</div>
			</div>
		</div>
	);
};
