"use client";

import { useEffect } from "react";
import { usePlaylist } from "@/hooks/use-playlist";
import { useAuthStore } from "@/stores/auth";
import { useShallow } from "zustand/react/shallow";
import { PlaylistAutoRequest } from "@hitbeatclub/shared-types";

interface PlaylistProviderProps {
	children: React.ReactNode;
	/** 자동 플레이리스트 초기화 설정 */
	autoPlaylistConfig?: PlaylistAutoRequest;
	/** Guest → Login 시 게스트 플레이리스트 유지 여부 */
	preserveGuestPlaylist?: boolean;
}

/**
 * 플레이리스트 프로바이더 컴포넌트
 * - 페이지 컨텍스트에 따른 자동 플레이리스트 초기화
 * - 인증 상태 변경 처리
 * - Guest → Login 시 플레이리스트 병합/덮어쓰기 처리
 */
export const PlaylistProvider = ({
	children,
	autoPlaylistConfig,
	preserveGuestPlaylist = true,
}: PlaylistProviderProps) => {
	const { user } = useAuthStore(useShallow((state) => ({ user: state.user })));
	const wasLoggedIn = user?.userId;

	const { trackIds, isLoggedIn, initializePlaylist, overwriteServerWithGuestPlaylist, createAutoPlaylist } =
		usePlaylist();

	// 컴포넌트 마운트 시 자동 플레이리스트 생성
	useEffect(() => {
		if (autoPlaylistConfig && trackIds.length === 0) {
			createAutoPlaylist(autoPlaylistConfig).catch((error) => {
				console.error("Failed to create auto playlist:", error);
			});
		}
	}, [autoPlaylistConfig, trackIds.length, createAutoPlaylist]);

	// 인증 상태 변경 처리
	useEffect(() => {
		// Guest → Login 전환 감지
		if (isLoggedIn && !wasLoggedIn && preserveGuestPlaylist && trackIds.length > 0) {
			// 게스트 플레이리스트를 서버로 덮어쓰기
			overwriteServerWithGuestPlaylist();
		} else if (isLoggedIn) {
			// 서버에서 플레이리스트 초기화
			initializePlaylist();
		}
	}, [
		isLoggedIn,
		wasLoggedIn,
		preserveGuestPlaylist,
		trackIds.length,
		overwriteServerWithGuestPlaylist,
		initializePlaylist,
	]);

	return <>{children}</>;
};

/**
 * 페이지별 플레이리스트 설정 헬퍼
 */
export const createPlaylistConfig = {
	/**
	 * 메인 페이지 설정
	 */
	main: (category: "ALL" | "BEAT" | "ACAPELLA" | "RECOMMEND" | "RECENT" = "ALL"): PlaylistAutoRequest => ({
		type: "MAIN",
		category,
	}),

	/**
	 * 검색 페이지 설정
	 */
	search: (query: any): PlaylistAutoRequest => ({
		type: "SEARCH",
		query,
	}),

	/**
	 * 아티스트 페이지 설정
	 */
	artist: (artistId: number, query: any = {}): PlaylistAutoRequest => ({
		type: "ARTIST",
		artistId,
		query: { ...query, isPublic: true },
	}),

	/**
	 * 팔로우 아티스트 곡 (로그인 전용)
	 */
	following: (query: any = {}): PlaylistAutoRequest => ({
		type: "FOLLOWING",
		query,
	}),

	/**
	 * 좋아요한 곡 (로그인 전용)
	 */
	liked: (query: any = {}): PlaylistAutoRequest => ({
		type: "LIKED",
		query,
	}),

	/**
	 * 장바구니 상품 곡
	 */
	cart: (): PlaylistAutoRequest => ({
		type: "CART",
	}),
};
