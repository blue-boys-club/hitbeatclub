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

	/** 다음 곡으로 이동 */
	playNext: () => PlaylistProduct | null;

	/** 이전 곡으로 이동 */
	playPrevious: () => PlaylistProduct | null;

	/** 반복 모드 토글 */
	toggleRepeatMode: () => void;

	/** 셔플 모드 토글 */
	toggleShuffleMode: () => void;
}

export interface PlaylistState {
	/** 플레이리스트 배열 */
	playlist: PlaylistProduct[];

	/** 현재 재생 중인 곡의 인덱스 (-1이면 없음) */
	currentIndex: number;

	/** 반복 모드 */
	repeatMode: 'none' | 'all';

	/** 셔플 모드 활성화 여부 */
	isShuffleMode: boolean;

	/** 셔플 전 원본 플레이리스트 순서 */
	originalPlaylist: PlaylistProduct[];
}

export type PlaylistStore = PlaylistState & PlaylistActions;

const initialState: PlaylistState = {
	playlist: [],
	currentIndex: -1,
	repeatMode: 'none',
	isShuffleMode: false,
	originalPlaylist: [],
};

const name = "PlaylistStore";

export const usePlaylistStore = create<PlaylistStore>()(
	devtools(
		(set, get) => ({
			...initialState,

			/** 플레이리스트 전체 교체 */
			setPlaylist: (products: PlaylistProduct[]) =>
				set((state) => ({
					playlist: products,
					currentIndex: products.length > 0 ? 0 : -1,
					originalPlaylist: state.isShuffleMode ? products : state.originalPlaylist,
				})),

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

			/** 다음 곡으로 이동 */
			playNext: () => {
				const { playlist, currentIndex } = get();
				if (playlist.length === 0) return null;
				
				// 다음 인덱스 계산 (순환)
				const nextIndex = (currentIndex + 1) % playlist.length;
				
				set((state) => ({
					...state,
					currentIndex: nextIndex,
				}));
				
				return playlist[nextIndex];
			},

			/** 이전 곡으로 이동 */
			playPrevious: () => {
				const { playlist, currentIndex } = get();
				if (playlist.length === 0) return null;
				
				// 이전 인덱스 계산 (순환)
				const previousIndex = currentIndex <= 0 ? playlist.length - 1 : currentIndex - 1;
				
				set((state) => ({
					...state,
					currentIndex: previousIndex,
				}));
				
				return playlist[previousIndex];
			},

			/** 반복 모드 토글 */
			toggleRepeatMode: () =>
				set((state) => {
					const modes: Array<'none' | 'all'> = ['none', 'all'];
					const currentIndex = modes.indexOf(state.repeatMode);
					const nextIndex = (currentIndex + 1) % modes.length;
					return {
						...state,
						repeatMode: modes[nextIndex],
					};
				}),

			/** 셔플 모드 토글 */
			toggleShuffleMode: () =>
				set((state) => {
					const newShuffleMode = !state.isShuffleMode;
					
					if (newShuffleMode) {
						// 셔플 모드 켜기: 원본 순서 저장 후 섞기
						const originalPlaylist = [...state.playlist];
						const currentTrack = state.playlist[state.currentIndex];
						
						// 현재 곡을 제외한 나머지 곡들을 섞기
						const otherTracks = state.playlist.filter((_, index) => index !== state.currentIndex);
						const shuffledOthers = [...otherTracks].sort(() => Math.random() - 0.5);
						
						// 현재 곡을 맨 앞에 두고 나머지는 섞인 순서로
						const shuffledPlaylist = currentTrack ? [currentTrack, ...shuffledOthers] : shuffledOthers;
						
						return {
							...state,
							isShuffleMode: true,
							originalPlaylist,
							playlist: shuffledPlaylist,
							currentIndex: currentTrack ? 0 : -1,
						};
					} else {
						// 셔플 모드 끄기: 원본 순서로 복원
						const currentTrack = state.playlist[state.currentIndex];
						const originalIndex = currentTrack 
							? state.originalPlaylist.findIndex(track => track.id === currentTrack.id)
							: -1;
						
						return {
							...state,
							isShuffleMode: false,
							playlist: [...state.originalPlaylist],
							currentIndex: originalIndex,
							originalPlaylist: [],
						};
					}
				}),
		}),
		{ name },
	),
);