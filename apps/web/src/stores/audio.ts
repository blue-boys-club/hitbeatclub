import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface AudioActions {
	setAudioData: (data: AudioState) => void;
	updateIsLiked: (isLiked: boolean) => void;
}

export interface AudioState {
	id: number | null;
	productName: string | null;
	seller: {
		id: number;
		stageName: string;
	} | null;
	isLiked: boolean | null;
	audioFile: {
		id: number;
		url: string;
		originName: string;
	} | null;
	coverImage: {
		id: number;
		url: string;
		originName: string;
	} | null;
}

export type AudioStore = AudioState & AudioActions;

const initialState: AudioState = {
	id: null,
	productName: null,
	seller: null,
	isLiked: null,
	audioFile: null,
	coverImage: null,
};

const name = "AudioStore";

export const useAudioStore = create<AudioStore>()(
	devtools(
		immer<AudioStore>((set) => ({
			...initialState,
			setAudioData: (data: AudioState) =>
				set((state) => {
					return data;
				}),
			updateIsLiked: (isLiked: boolean) =>
				set((state) => {
					state.isLiked = isLiked;
				}),
		})),
		{ name },
	),
);
