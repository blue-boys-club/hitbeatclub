"use client";

import { memo } from "react";
import { ArtistInfo } from "@/features/artist/components/ArtistInfo";
import { ProductList } from "@/features/product/components";
/**
 * 아티스트 페이지의 메인 컴포넌트
 * - 아티스트 정보 헤더 표시
 * - 트랙 필터링, 정렬, 검색 기능
 * - 트랙 목록 표시
 */
const ArtistProductListPage = memo(() => {
	const dummyProducts = Array.from({ length: 20 }, (_, i) => i);

	return (
		<>
			<ArtistInfo />
			<ProductList
				products={dummyProducts}
				onFiltersChange={() => {}}
				onSortChange={() => {}}
				onSearch={() => {}}
			/>
		</>
	);
});

ArtistProductListPage.displayName = "ArtistProductListPage";

export default ArtistProductListPage;
