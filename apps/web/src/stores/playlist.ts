import { create } from "zustand";
import { devtools } from "zustand/middleware";

// 플레이리스트용 Product 타입
export interface PlaylistProduct {
	id: number;
	productName: string;
	coverImage?: { url: string };
	seller?: { stageName: string };
}

export interface PlaylistActions {
	/** 플레이리스트 전체 교체 */
	setPlaylist: (products: PlaylistProduct[]) => void;

	/** 플레이리스트에 곡 추가 */
	addToPlaylist: (product: PlaylistProduct) => void;

	/** 플레이리스트에서 곡 제거 */
	removeFromPlaylist: (index: number) => void;

	/** 현재 재생 중인 곡의 인덱스 설정 */
	setCurrentIndex: (index: number) => void;

	/** 플레이리스트 초기화 */
	clearPlaylist: () => void;

	/** 현재 재생 중인 곡 가져오기 */
	getCurrentTrack: () => PlaylistProduct | null;
}

export interface PlaylistState {
	/** 플레이리스트 배열 */
	playlist: PlaylistProduct[];

	/** 현재 재생 중인 곡의 인덱스 (-1이면 없음) */
	currentIndex: number;
}

export type PlaylistStore = PlaylistState & PlaylistActions;

const initialState: PlaylistState = {
	playlist: [],
	currentIndex: -1,
};

const name = "PlaylistStore";

export const usePlaylistStore = create<PlaylistStore>()(
	devtools(
		(set, get) => ({
			...initialState,

			/** 플레이리스트 전체 교체 */
			setPlaylist: (products: PlaylistProduct[]) =>
				set({
					playlist: products,
					currentIndex: products.length > 0 ? 0 : -1,
				}),

			/** 플레이리스트에 곡 추가 */
			addToPlaylist: (product: PlaylistProduct) =>
				set((state) => {
					const existingIndex = state.playlist.findIndex(item => item.id === product.id);
					if (existingIndex !== -1) {
						// 이미 존재하는 경우 현재 인덱스만 업데이트
						return {
							...state,
							currentIndex: existingIndex,
						};
					}
					// 새로운 곡을 플레이리스트에 추가
					const newPlaylist = [...state.playlist, product];
					return {
						...state,
						playlist: newPlaylist,
						currentIndex: newPlaylist.length - 1,
					};
				}),

			/** 플레이리스트에서 곡 제거 */
			removeFromPlaylist: (index: number) =>
				set((state) => {
					const newPlaylist = state.playlist.filter((_, i) => i !== index);
					let newCurrentIndex = state.currentIndex;

					if (index === state.currentIndex) {
						// 현재 재생 중인 곡이 제거된 경우
						newCurrentIndex = newPlaylist.length > 0 ? Math.min(state.currentIndex, newPlaylist.length - 1) : -1;
					} else if (index < state.currentIndex) {
						// 현재 곡보다 앞의 곡이 제거된 경우 인덱스 조정
						newCurrentIndex = state.currentIndex - 1;
					}

					return {
						...state,
						playlist: newPlaylist,
						currentIndex: newCurrentIndex,
					};
				}),

			/** 현재 재생 중인 곡의 인덱스 설정 */
			setCurrentIndex: (index: number) =>
				set((state) => ({
					...state,
					currentIndex: Math.max(-1, Math.min(index, state.playlist.length - 1)),
				})),

			/** 플레이리스트 초기화 */
			clearPlaylist: () =>
				set({
					playlist: [],
					currentIndex: -1,
				}),

			/** 현재 재생 중인 곡 가져오기 */
			getCurrentTrack: () => {
				const { playlist, currentIndex } = get();
				if (currentIndex >= 0 && currentIndex < playlist.length) {
					return playlist[currentIndex];
				}
				return null;
			},
		}),
		{ name },
	),
);