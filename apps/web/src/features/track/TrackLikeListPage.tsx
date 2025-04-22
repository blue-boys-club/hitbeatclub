"use client";

import { memo } from "react";
import { LikesHeader } from "./TrackLikeHeader";
import { TrackList } from "@/features/track";

/**
 * 좋아요 페이지의 메인 컴포넌트
 * - 좋아요 페이지 헤더 표시
 * - 트랙 필터링, 정렬, 검색 기능
 * - 좋아요한 트랙 목록 표시
 */
const TrackLikeListPage = memo(() => {
	const dummyTracks = Array.from({ length: 20 }, (_, i) => i);

	return (
		<>
			<LikesHeader />

			<TrackList
				tracks={dummyTracks}
				onFiltersChange={() => {}}
				onSortChange={() => {}}
				onSearch={() => {}}
			/>
		</>
	);
});

TrackLikeListPage.displayName = "TrackLikeListPage";

export default TrackLikeListPage;
