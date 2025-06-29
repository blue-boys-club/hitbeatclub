import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type AudioStatus = "idle" | "playing" | "paused" | "ended";

export interface AudioActions {
	/** 현재 재생 중인 상품 ID 설정 */
	setProductId: (productId: number | null) => void;

	/** 재생 상태를 문자열(status) 기반으로 설정 */
	setStatus: (status: AudioStatus) => void;

	/** 편의용: boolean 기반 재생 상태 설정 */
	setIsPlaying: (isPlaying: boolean) => void;

	/** 볼륨(0~1) 설정 */
	setVolume: (volume: number) => void;

	/** 음소거 토글 */
	toggleMute: () => void;
}

export interface AudioState {
	/** 재생 중인 상품 ID. 없으면 null */
	productId: number | null;

	/** 상세 재생 상태 */
	status: AudioStatus;

	/** `status === "playing"` 여부를 캐싱한 boolean 값  */
	isPlaying: boolean;

	/** 현재 볼륨 (0~1) */
	volume: number;

	/** 음소거 여부 */
	isMuted: boolean;

	/** 음소거 직전 볼륨(복원용) */
	lastVolume: number;
}

export type AudioStore = AudioState & AudioActions;

const initialState: AudioState = {
	productId: null,
	status: "idle",
	isPlaying: false,
	volume: 0.5,
	isMuted: false,
	lastVolume: 0.5,
};

const name = "AudioStore";

export const useAudioStore = create<AudioStore>()(
	devtools(
		persist(
			(set, get) => ({
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

				/** 볼륨(0~1) 설정. 0이면 isMuted도 true 로 설정 */
				setVolume: (volume: number) =>
					set((state) => ({
						volume,
						isMuted: volume === 0,
						lastVolume: volume > 0 ? volume : state.lastVolume,
					})),

				/** 음소거 토글 */
				toggleMute: () =>
					set((state) => {
						if (state.isMuted) {
							// unmute => restore lastVolume (min 0.05)
							const restored = Math.max(state.lastVolume, 0.05);
							return {
								isMuted: false,
								volume: restored,
							};
						}
						// mute
						return {
							isMuted: true,
							volume: 0,
						};
					}),
			}),
			{
				name,
				partialize: (state) => ({
					volume: state.volume,
					isMuted: state.isMuted,
					lastVolume: state.lastVolume,
				}),
			},
		),
	),
);
