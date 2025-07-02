import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { enableMapSet } from "immer";

enableMapSet();

export interface PlaylistActions {
	/** 현재 재생 중인 상품 ID 설정 */
	setCurrentTrackIds: (trackIds: number[], currentIndex?: number) => void;

	/** 현재 재생 중인 트랙 인덱스 설정 */
	setCurrentIndex: (currentIndex: number) => void;

	/** 현재 재생 중인 트랙 인덱스 증가 (Next) */
	increaseCurrentIndex: () => void;

	/** 현재 재생 중인 트랙 인덱스 감소 (Previous) */
	decreaseCurrentIndex: () => void;

	/** 재생 불가 트랙 추가 */
	addUnplayableTrack: (trackId: number) => void;

	/** 재생 불가 트랙 제거 */
	removeUnplayableTrack: (trackId: number) => void;

	/** 재생 불가 트랙 목록 초기화 */
	clearUnplayableTracks: () => void;

	/** 서버 동기화 상태 설정 */
	setSyncStatus: (status: "idle" | "syncing" | "error") => void;

	/** 마지막 동기화 시간 설정 */
	setLastSyncTime: (time: number) => void;

	/** 셔플 모드 토글 */
	toggleShuffle: () => void;

	/** 반복 모드 변경 */
	setRepeatMode: (mode: "none" | "one" | "all") => void;

	/** 반복 모드 토글 (none -> one -> all -> none) */
	toggleRepeatMode: () => void;

	/** 현재 플레이 가능한 트랙 ID 가져오기 */
	getCurrentPlayableTrackId: () => number | null;

	/** 다음 플레이 가능한 트랙 인덱스 가져오기 (셔플/반복 모드 고려) */
	getNextPlayableIndex: () => number | null;

	/** 이전 플레이 가능한 트랙 인덱스 가져오기 (셔플/반복 모드 고려) */
	getPreviousPlayableIndex: () => number | null;

	/** 플레이리스트 길이 제한 (최대 100곡) */
	enforceMaxLength: () => void;

	/** 초기화 */
	init: () => void;

	/** 최근 트랙 기록 */
	addRecentTrack: (trackId: number) => void;
}

export interface PlaylistState {
	trackIds: number[];
	currentIndex: number;
	/** 재생 불가 트랙 ID 집합 (세션 단위) */
	unplayableTrackIds: Set<number>;
	/** 서버 동기화 상태 */
	syncStatus: "idle" | "syncing" | "error";
	/** 마지막 동기화 시간 (timestamp) */
	lastSyncTime: number;
	/** 셔플 모드 활성화 여부 */
	isShuffleEnabled: boolean;
	/** 반복 모드 */
	repeatMode: "none" | "one" | "all";
	/** 셔플된 트랙 순서 (셔플 모드에서 사용) */
	shuffledOrder: number[];
	/** 셔플 시드 (셔플 순서 재현을 위한 시드) */
	shuffleSeed: number;
	/** 최근 재생 트랙 ID 배열 (최대 30곡) */
	recentTrackIds: number[];
}

export type PlaylistStore = PlaylistState & PlaylistActions;

const initialState: PlaylistState = {
	trackIds: [],
	currentIndex: 0,
	unplayableTrackIds: new Set(),
	syncStatus: "idle",
	lastSyncTime: 0,
	isShuffleEnabled: false,
	repeatMode: "none",
	shuffledOrder: [],
	shuffleSeed: 0,
	recentTrackIds: [],
};

/** 시드를 기반으로 한 Fisher-Yates 셔플 알고리즘 */
const shuffleArray = (array: number[], seed: number): number[] => {
	const shuffled = [...array];
	let random = seed;

	for (let i = shuffled.length - 1; i > 0; i--) {
		// 간단한 LCG (Linear Congruential Generator)
		random = (random * 1664525 + 1013904223) % Math.pow(2, 32);
		const j = Math.floor((random / Math.pow(2, 32)) * (i + 1));

		// 배열 범위 확인 후 안전하게 스왑
		if (j >= 0 && j < shuffled.length && i >= 0 && i < shuffled.length) {
			const temp = shuffled[i]!;
			shuffled[i] = shuffled[j]!;
			shuffled[j] = temp;
		}
	}

	return shuffled;
};

const name = "PlaylistStore";

export const usePlaylistStore = create<PlaylistStore>()(
	devtools(
		persist(
			immer((set, get) => ({
				...initialState,

				/** trackIds와 currentIndex를 함께 업데이트 */
				setCurrentTrackIds: (trackIds: number[], currentIndex = 0) =>
					set((state) => {
						state.trackIds = trackIds.slice(0, 100); // 최대 100곡 제한
						state.currentIndex = Math.max(0, Math.min(currentIndex, trackIds.length - 1));

						// 셔플이 활성화되어 있으면 새로운 셔플 순서 생성 (현재 트랙을 맨 앞으로 고정)
						if (state.isShuffleEnabled && state.trackIds.length > 0) {
							state.shuffleSeed = Date.now();

							const currentIdx = state.currentIndex;
							const rest = Array.from({ length: state.trackIds.length }, (_, i) => i).filter((i) => i !== currentIdx);
							const shuffledRest = shuffleArray(rest, state.shuffleSeed);
							state.shuffledOrder = [currentIdx, ...shuffledRest];
						}
					}),

				/** currentIndex 값을 업데이트 */
				setCurrentIndex: (currentIndex: number) =>
					set((state) => {
						const maxIndex = state.trackIds.length - 1;
						state.currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
					}),

				/** 현재 재생 중인 트랙 인덱스 증가 (Next) */
				increaseCurrentIndex: () =>
					set((state) => {
						const maxIndex = state.trackIds.length - 1;
						if (state.currentIndex < maxIndex) {
							state.currentIndex += 1;
						}
					}),

				/** 현재 재생 중인 트랙 인덱스 감소 (Previous) */
				decreaseCurrentIndex: () =>
					set((state) => {
						if (state.currentIndex > 0) {
							state.currentIndex -= 1;
						}
					}),

				/** 재생 불가 트랙 추가 */
				addUnplayableTrack: (trackId: number) =>
					set((state) => {
						state.unplayableTrackIds.add(trackId);
					}),

				/** 재생 불가 트랙 제거 */
				removeUnplayableTrack: (trackId: number) =>
					set((state) => {
						state.unplayableTrackIds.delete(trackId);
					}),

				/** 재생 불가 트랙 목록 초기화 */
				clearUnplayableTracks: () =>
					set((state) => {
						state.unplayableTrackIds.clear();
					}),

				/** 서버 동기화 상태 설정 */
				setSyncStatus: (status: "idle" | "syncing" | "error") =>
					set((state) => {
						state.syncStatus = status;
					}),

				/** 마지막 동기화 시간 설정 */
				setLastSyncTime: (time: number) =>
					set((state) => {
						state.lastSyncTime = time;
					}),

				/** 셔플 모드 토글 */
				toggleShuffle: () =>
					set((state) => {
						state.isShuffleEnabled = !state.isShuffleEnabled;

						if (state.isShuffleEnabled && state.trackIds.length > 0) {
							// 셔플 활성화: 현재 트랙을 맨 앞으로, 나머지를 셔플
							state.shuffleSeed = Date.now();

							const currentIdx = state.currentIndex;
							const rest = Array.from({ length: state.trackIds.length }, (_, i) => i).filter((i) => i !== currentIdx);
							const shuffledRest = shuffleArray(rest, state.shuffleSeed);
							state.shuffledOrder = [currentIdx, ...shuffledRest];
						} else {
							// 셔플 비활성화: 셔플 순서 초기화
							state.shuffledOrder = [];
						}
					}),

				/** 반복 모드 설정 */
				setRepeatMode: (mode: "none" | "one" | "all") =>
					set((state) => {
						state.repeatMode = mode;
					}),

				/** 반복 모드 토글 */
				toggleRepeatMode: () =>
					set((state) => {
						switch (state.repeatMode) {
							case "none":
								state.repeatMode = "one";
								break;
							case "one":
								state.repeatMode = "all";
								break;
							case "all":
								state.repeatMode = "none";
								break;
						}
					}),

				/** 현재 플레이 가능한 트랙 ID 가져오기 */
				getCurrentPlayableTrackId: () => {
					const state = get();
					const currentTrackId = state.trackIds[state.currentIndex];
					if (currentTrackId && !state.unplayableTrackIds.has(currentTrackId)) {
						return currentTrackId;
					}
					return null;
				},

				/** 다음 플레이 가능한 트랙 인덱스 가져오기 (셔플/반복 모드 고려) */
				getNextPlayableIndex: () => {
					const state = get();

					// 반복 모드가 "one"이면 현재 인덱스 반환
					if (state.repeatMode === "one") {
						const currentTrackId = state.trackIds[state.currentIndex];
						if (currentTrackId && !state.unplayableTrackIds.has(currentTrackId)) {
							return state.currentIndex;
						}
					}

					const playOrder = state.isShuffleEnabled
						? state.shuffledOrder
						: Array.from({ length: state.trackIds.length }, (_, i) => i);

					const currentOrderIndex = playOrder.indexOf(state.currentIndex);
					if (currentOrderIndex === -1) return null;

					// 현재 인덱스 이후부터 찾기
					for (let i = currentOrderIndex + 1; i < playOrder.length; i++) {
						const trackIndex = playOrder[i];
						if (trackIndex === undefined) continue;
						const trackId = state.trackIds[trackIndex];
						if (trackId && !state.unplayableTrackIds.has(trackId)) {
							return trackIndex;
						}
					}

					// 반복 모드가 "all"이면 처음부터 다시 찾기
					if (state.repeatMode === "all") {
						for (let i = 0; i <= currentOrderIndex; i++) {
							const trackIndex = playOrder[i];
							if (trackIndex === undefined) continue;
							const trackId = state.trackIds[trackIndex];
							if (trackId && !state.unplayableTrackIds.has(trackId)) {
								return trackIndex;
							}
						}
					}

					return null;
				},

				/** 이전 플레이 가능한 트랙 인덱스 가져오기 (셔플/반복 모드 고려) */
				getPreviousPlayableIndex: () => {
					const state = get();

					// 반복 모드가 "one"이면 현재 인덱스 반환
					if (state.repeatMode === "one") {
						const currentTrackId = state.trackIds[state.currentIndex];
						if (currentTrackId && !state.unplayableTrackIds.has(currentTrackId)) {
							return state.currentIndex;
						}
					}

					const playOrder = state.isShuffleEnabled
						? state.shuffledOrder
						: Array.from({ length: state.trackIds.length }, (_, i) => i);

					const currentOrderIndex = playOrder.indexOf(state.currentIndex);
					if (currentOrderIndex === -1) return null;

					// 현재 인덱스 이전부터 찾기
					for (let i = currentOrderIndex - 1; i >= 0; i--) {
						const trackIndex = playOrder[i];
						if (trackIndex === undefined) continue;
						const trackId = state.trackIds[trackIndex];
						if (trackId && !state.unplayableTrackIds.has(trackId)) {
							return trackIndex;
						}
					}

					// 반복 모드가 "all"이면 끝에서부터 다시 찾기
					if (state.repeatMode === "all") {
						for (let i = playOrder.length - 1; i >= currentOrderIndex; i--) {
							const trackIndex = playOrder[i];
							if (trackIndex === undefined) continue;
							const trackId = state.trackIds[trackIndex];
							if (trackId && !state.unplayableTrackIds.has(trackId)) {
								return trackIndex;
							}
						}
					}

					return null;
				},

				/** 플레이리스트 길이 제한 (최대 100곡) */
				enforceMaxLength: () =>
					set((state) => {
						if (state.trackIds.length > 100) {
							// FIFO: 앞에서부터 제거
							const removedCount = state.trackIds.length - 100;
							state.trackIds = state.trackIds.slice(removedCount);
							state.currentIndex = Math.max(0, state.currentIndex - removedCount);

							// 셔플 순서도 업데이트 (현재 트랙을 맨 앞으로 고정)
							if (state.isShuffleEnabled) {
								state.shuffleSeed = Date.now();
								const currentIdx = state.currentIndex;
								const rest = Array.from({ length: state.trackIds.length }, (_, i) => i).filter((i) => i !== currentIdx);
								const shuffledRest = shuffleArray(rest, state.shuffleSeed);
								state.shuffledOrder = [currentIdx, ...shuffledRest];
							}
						}
					}),

				/** 초기화 */
				init: () => set(initialState),

				/** 최근 트랙 추가 (중복 제거, 최대 30곡 유지) */
				addRecentTrack: (trackId: number) =>
					set((state) => {
						// 앞에서 중복 제거하고 맨 앞에 삽입
						state.recentTrackIds = [trackId, ...state.recentTrackIds.filter((id) => id !== trackId)].slice(0, 30);
					}),
			})),
			{
				name,
				storage: createJSONStorage(() => localStorage),
				// unplayableTrackIds는 세션 단위이므로 localStorage에 저장하지 않음
				partialize: (state) => ({
					trackIds: state.trackIds,
					currentIndex: state.currentIndex,
					syncStatus: state.syncStatus,
					lastSyncTime: state.lastSyncTime,
					isShuffleEnabled: state.isShuffleEnabled,
					repeatMode: state.repeatMode,
					shuffledOrder: state.shuffledOrder,
					shuffleSeed: state.shuffleSeed,
					recentTrackIds: state.recentTrackIds,
				}),
			},
		),
		{ name },
	),
);
