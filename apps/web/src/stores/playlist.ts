import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface PlaylistActions {
	/** 현재 재생 중인 상품 ID 설정 */
	setCurrentTrackIds: (trackIds: number[], currentIndex?: number) => void;

	/** 현재 재생 중인 트랙 인덱스 설정 */
	setCurrentIndex: (currentIndex: number) => void;

	/** 현재 재생 중인 트랙 인덱스 증가 (Next) */
	increaseCurrentIndex: () => void;

	/** 현재 재생 중인 트랙 인덱스 감소 (Previous) */
	decreaseCurrentIndex: () => void;

	/** 초기화 */
	init: () => void;
}

export interface PlaylistState {
	trackIds: number[];
	currentIndex: number;
}

export type PlaylistStore = PlaylistState & PlaylistActions;

const initialState: PlaylistState = {
	trackIds: [],
	currentIndex: 0,
};

const name = "PlaylistStore";

export const usePlaylistStore = create<PlaylistStore>()(
	devtools(
		(set) => ({
			...initialState,

			/** trackIds만 업데이트 */
			setCurrentTrackIds: (trackIds: number[], currentIndex?: number) => set({ trackIds, currentIndex }),

			/** currentIndex 값을 업데이트 */
			setCurrentIndex: (currentIndex: number) => set({ currentIndex }),

			/** 현재 재생 중인 트랙 인덱스 증가 (Next) */
			increaseCurrentIndex: () => set((state) => ({ currentIndex: state.currentIndex + 1 })),

			/** 현재 재생 중인 트랙 인덱스 감소 (Previous) */
			decreaseCurrentIndex: () => set((state) => ({ currentIndex: state.currentIndex - 1 })),

			/** 초기화 */
			init: () => set(initialState),
		}),
		{ name },
	),
);
