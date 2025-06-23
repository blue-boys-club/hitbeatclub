"use client";

import { memo } from "react";
import { ArtistInfo } from "@/features/artist/components/ArtistInfo";
import { ArtistProductList } from "@/features/artist/components/ArtistProductList";
/**
 * 아티스트 페이지의 메인 컴포넌트
 * - 아티스트 정보 헤더 표시
 * - 트랙 필터링, 정렬, 검색 기능
 * - 트랙 목록 표시
 */

interface ArtistProductListPageProps {
	slug: string;
}

const ArtistProductListPage = memo(({ slug }: ArtistProductListPageProps) => {
	return (
		<>
			<ArtistInfo slug={slug} />
			<ArtistProductList slug={slug} />
		</>
	);
});

ArtistProductListPage.displayName = "ArtistProductListPage";

export default ArtistProductListPage;
