import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface AudioActions {
	setProductId: (productId: number | null) => void;
	setIsPlaying: (isPlaying: boolean) => void;
}

export interface AudioState {
	productId: number | null;
	isPlaying: boolean;
}

export type AudioStore = AudioState & AudioActions;

const initialState: AudioState = {
	productId: null,
	isPlaying: false,
};

const name = "AudioStore";

export const useAudioStore = create<AudioStore>()(
	devtools(
		(set) => ({
			...initialState,
			setProductId: (productId: number | null) => set({ productId }),
			setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
		}),
		{ name },
	),
);
