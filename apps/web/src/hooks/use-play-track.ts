import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { SidebarType, useLayoutStore } from "@/stores/layout";
import { useAudioStore } from "@/stores/audio";
import { useShallow } from "zustand/react/shallow";
import { useToast } from "@/hooks/use-toast";
import { useAudioContext } from "@/contexts/AudioContext";
import { usePlaylist } from "@/hooks/use-playlist";

/**
 * 재생(플레이어 시작) 로직을 공통 Hook 으로 분리합니다.
 *
 * 사용 예시:
 * const playTrack = usePlayTrack();
 * playTrack(123); // productId 123 번 재생
 */
export const usePlayTrackCore = () => {
	/** 사용자 정보 (로그인 여부 확인) */
	const { data: user } = useQuery({ ...getUserMeQueryOption(), retry: false });
	const { toast } = useToast();

	/** 오디오 관련 상태 */
	const { productId: currentProductId, setProductId } = useAudioStore(
		useShallow((state) => ({
			productId: state.productId,
			setProductId: state.setProductId,
		})),
	);

	/** 레이아웃(사이드바) 관련 상태 */
	const { isRightSidebarOpen, setRightSidebar, setPlayer } = useLayoutStore(
		useShallow((state) => ({
			isRightSidebarOpen: state.rightSidebar.isOpen,
			setRightSidebar: state.setRightSidebar,
			setPlayer: state.setPlayer,
		})),
	);

	/** 플레이리스트 관리 */
	const { trackIds, addTrackToPlaylist, playTrackAtIndex, currentPlayableTrackId, isLoggedIn } = usePlaylist();

	/** AudioContext for controlling actual playback */
	const { togglePlay } = useAudioContext();

	/**
	 * 트랙 재생 핸들러
	 * @param productId 재생할 트랙의 상품 ID
	 */
	const playTrack = useCallback(
		(productId: number) => {
			// 같은 트랙을 다시 클릭했을 때 토글 처리 (재생 중 -> 일시정지, 일시정지 -> 재생)
			if (currentProductId === productId) {
				// 오디오 컨텍스트 재생/일시정지
				togglePlay();
				return;
			}

			// 로그인된 경우 - 플레이리스트 시스템 사용
			if (isLoggedIn) {
				try {
					// 트랙이 이미 플레이리스트에 있는지 확인
					const existingIndex = trackIds.indexOf(productId);

					if (existingIndex !== -1) {
						// 이미 플레이리스트에 있으면 해당 인덱스로 이동
						playTrackAtIndex(existingIndex);
					} else {
						// 플레이리스트에 없으면 추가하고 재생
						addTrackToPlaylist(productId);
						// 새로 추가된 트랙은 마지막 인덱스에 위치
						const newIndex = trackIds.length;
						playTrackAtIndex(newIndex);
					}

					// 오디오 스토어에 현재 트랙 ID 설정
					setProductId(productId);
				} catch (error) {
					toast({
						description: "재생에 실패했습니다.",
						variant: "destructive",
					});
					return;
				}
			}
			// 비로그인 상태 -> toast 메시지 표시 후 미 재생
			else {
				toast({
					description: "로그인 후 이용해주세요.",
				});
				return;
			}

			// 공통적으로 player 스토어에 현재 트랙 ID 반영
			setPlayer({ trackId: productId });

			// 우측 사이드바 타입 제어
			// - 플레이리스트가 열려있지 않거나
			// - 비로그인 상태인 경우
			//   => 음악 상세(MusicRightSidebar)로 전환
			if (!isRightSidebarOpen || !isLoggedIn) {
				setRightSidebar(true, { currentType: SidebarType.TRACK });
			}
		},
		[
			currentProductId,
			isLoggedIn,
			trackIds,
			addTrackToPlaylist,
			playTrackAtIndex,
			setProductId,
			togglePlay,
			toast,
			setPlayer,
			isRightSidebarOpen,
			setRightSidebar,
		],
	);

	return playTrack;
};

/**
 * Wrapper hook exposing a simple API
 * Usage:
 *   const { play } = usePlayTrack();
 *   play(trackId);
 */
export const usePlayTrack = () => {
	const playTrack = usePlayTrackCore();

	const play = useCallback(
		(trackId?: number | null) => {
			if (typeof trackId === "number") {
				playTrack(trackId);
			}
		},
		[playTrack],
	);

	return { play };
};
