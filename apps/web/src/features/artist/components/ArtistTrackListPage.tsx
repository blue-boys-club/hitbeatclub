"use client";

import { memo } from "react";
import { ArtistInfo } from "./ArtistInfo";
import { TrackList } from "@/features/track";

/**
 * 아티스트 페이지의 메인 컴포넌트
 * - 아티스트 정보 헤더 표시
 * - 트랙 필터링, 정렬, 검색 기능
 * - 트랙 목록 표시
 */
const ArtistTrackListPage = memo(() => {
	const dummyTracks = Array.from({ length: 20 }, (_, i) => i);

	return (
		<>
			<ArtistInfo />
			<TrackList
				tracks={dummyTracks}
				onFiltersChange={() => {}}
				onSortChange={() => {}}
				onSearch={() => {}}
			/>
		</>
	);
});

ArtistTrackListPage.displayName = "ArtistTrackListPage";

export default ArtistTrackListPage;
