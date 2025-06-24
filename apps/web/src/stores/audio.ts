import { create } from "zustand";
import { devtools } from "zustand/middleware";

type AudioStatus = "idle" | "playing" | "paused" | "ended";

export interface AudioActions {
	/** 현재 재생 중인 상품 ID 설정 */
	setProductId: (productId: number | null) => void;

	/** 재생 상태를 문자열(status) 기반으로 설정 */
	setStatus: (status: AudioStatus) => void;

	/** 편의용: boolean 기반 재생 상태 설정 */
	setIsPlaying: (isPlaying: boolean) => void;
}

export interface AudioState {
	/** 재생 중인 상품 ID. 없으면 null */
	productId: number | null;

	/** 상세 재생 상태 */
	status: AudioStatus;

	/** `status === "playing"` 여부를 캐싱한 boolean 값  */
	isPlaying: boolean;
}

export type AudioStore = AudioState & AudioActions;

const initialState: AudioState = {
	productId: null,
	status: "idle",
	isPlaying: false,
};

const name = "AudioStore";

export const useAudioStore = create<AudioStore>()(
	devtools(
		(set) => ({
			...initialState,

			/** productId만 업데이트 */
			setProductId: (productId: number | null) => set({ productId }),

			/** status 값을 업데이트하고, isPlaying boolean도 동기화 */
			setStatus: (status: AudioStatus) =>
				set({
					status,
					isPlaying: status === "playing",
				}),

			/** boolean 값을 받아 status와 동기화 */
			setIsPlaying: (isPlaying: boolean) =>
				set({
					isPlaying,
					status: isPlaying ? "playing" : "paused",
				}),
		}),
		{ name },
	),
);
