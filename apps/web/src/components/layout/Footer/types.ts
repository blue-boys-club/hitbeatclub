import { type RefObject } from "react";
import ReactPlayer from "react-player";

interface Volume {
	currentVolume: number;
	prevVolume: number;
}

export interface AudioPlayerProps {
	url: string;
	playerRef: RefObject<ReactPlayer | null>;
	isPlaying: boolean;
	volume: Volume;
	repeatMode: "none" | "one" | "all";
	shuffle: boolean;
	currentTime: number;
	duration: number;
	togglePlay: () => void;
	toggleRepeatMode: () => void;
	toggleShuffle: () => void;
	onPrevious: () => void;
	onNext: () => void;
	onProgress: (playedSeconds: number) => void;
	onDuration: (duration: number) => void;
	onEnded: () => void;
	onSeek: (seconds: number) => void;
}

export interface VolumeControlProps {
	volume: Volume;
	isMuted: boolean;
	onVolumeChange: (value: number[]) => void;
	onMuteToggle: () => void;
}
