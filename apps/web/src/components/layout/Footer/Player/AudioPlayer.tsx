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
import * as Slider from "@radix-ui/react-slider";
import { useCallback, useState, useEffect } from "react";

interface AudioPlayerProps {
	url: string;
}

export const AudioPlayer = ({ url }: AudioPlayerProps) => {
	const {
		playerRef,
		isPlaying,
		volume,
		currentTime,
		duration,
		isUserSeeking,
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
	} = useAudioContext();

	// 플레이리스트에서 셔플/반복 상태 가져오기
	const { isShuffleEnabled, repeatMode } = usePlaylist();

	// 슬라이더 드래그 중 임시 값 저장
	const [tempSeekValue, setTempSeekValue] = useState<number>(currentTime);

	// 사용자가 시크바를 조작하지 않을 때만 currentTime과 동기화
	useEffect(() => {
		if (!isUserSeeking) {
			setTempSeekValue(currentTime);
		}
	}, [currentTime, isUserSeeking]);

	// 슬라이더 드래그 시작
	const handleSeekStart = useCallback(() => {
		onSeekStart();
		setTempSeekValue(currentTime);
	}, [currentTime, onSeekStart]);

	// 슬라이더 값 변경 중 (드래그 중)
	const handleSeekChange = useCallback((value: number[]) => {
		const newTime = value[0] ?? 0;
		setTempSeekValue(newTime);
	}, []);

	// 슬라이더 드래그 완료
	const handleSeekEnd = useCallback(
		(value: number[]) => {
			const newTime = value[0] ?? 0;
			onSeek(newTime);
			setTempSeekValue(newTime);
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
					className="relative flex h-5 w-[500px] items-center cursor-pointer group"
					value={[tempSeekValue]}
					min={0}
					max={duration}
					step={1}
					onValueChange={handleSeekChange}
					onValueCommit={handleSeekEnd}
					onPointerDown={handleSeekStart}
				>
					<Slider.Track className="relative h-[2px] grow bg-black">
						<Slider.Range className="absolute h-[6px] top-1/2 -translate-y-1/2 bg-black" />
					</Slider.Track>
					<Slider.Thumb
						className="transition-opacity duration-200 opacity-0 group-hover:opacity-100"
						aria-label="Time"
					>
						<VolumeThumb />
					</Slider.Thumb>
				</Slider.Root>
				<div className="text-black text-base font-bold font-suit leading-3">{formatTime(duration)}</div>
			</div>
		</div>
	);
};
