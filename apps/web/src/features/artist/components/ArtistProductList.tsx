import { memo, useCallback, useMemo, useState, useEffect } from "react";
import { ProductItem, ProductSearch, ProductSort } from "@/features/product/components";
import { ArtistProductFilter } from "@/features/artist/components/ArtistProductFilter";
import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { getArtistProductListBySlugInfiniteQueryOption } from "@/apis/artist/query/artist.query-options";
import type { ArtistProductListQueryRequest } from "@hitbeatclub/shared-types/artist";
import type { ProductListItem } from "@/features/product/product.types";

interface ArtistProductListProps {
	slug: string;
}

/**
 * ArtistProductList (아티스트 트랙 목록 컴포넌트)
 * - 필터, 정렬, 검색 기능 제공
 * - 무한 스크롤 기반 트랙 목록 렌더링
 */
export const ArtistProductList = memo(({ slug }: ArtistProductListProps) => {
	// 필터 및 정렬, 검색 상태
	const [filters, setFilters] = useState<Omit<ArtistProductListQueryRequest, "page" | "limit">>({
		sort: "RECENT",
		isPublic: true,
	});

	const handleFiltersChange = useCallback((newFilters: Omit<ArtistProductListQueryRequest, "page" | "limit">) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	}, []);

	const handleSortChange = useCallback((value: string) => {
		setFilters((prev) => ({ ...prev, sort: value.toUpperCase() as any }));
	}, []);

	// 검색어 상태 (API가 지원되면 확장)
	const [searchTerm, setSearchTerm] = useState<string>("");
	const handleSearch = useCallback((value: string) => {
		setSearchTerm(value);
	}, []);

	// Debounce keyword to avoid rapid server calls
	useEffect(() => {
		const handler = setTimeout(() => {
			setFilters((prev) => {
				const newFilters = { ...prev } as any;
				if (searchTerm.trim()) {
					newFilters.keyword = searchTerm.trim();
				} else {
					delete newFilters.keyword;
				}
				return newFilters;
			});
		}, 300);

		return () => clearTimeout(handler);
	}, [searchTerm]);

	// Infinite query
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } = useInfiniteQuery({
		...getArtistProductListBySlugInfiniteQueryOption(slug, filters),
		placeholderData: keepPreviousData,
	});

	// 필터 혹은 키워드 변경 시 첫 페이지 다시 요청
	useEffect(() => {
		refetch();
	}, [filters, refetch]);

	// 평탄화된 상품 리스트
	const products = useMemo<ProductListItem[]>(() => {
		if (!data?.pages) return [];
		return data.pages.flat();
	}, [data?.pages]);

	// 검색어로 필터링
	const filteredProducts = useMemo<ProductListItem[]>(() => {
		if (!searchTerm) return products;
		const keyword = searchTerm.toLowerCase();
		return products.filter((p) => p.productName.toLowerCase().includes(keyword));
	}, [products, searchTerm]);

	// Intersection Observer for infinite scroll
	const { ref: loadMoreRef, inView } = useInView({ threshold: 0, rootMargin: "100px" });

	useMemo(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

	// Skeleton UI
	const renderSkeleton = useMemo(
		() => (
			<div className="flex flex-col gap-2.5">
				{Array.from({ length: 5 }).map((_, index) => (
					<div
						key={index}
						className="flex justify-between items-center hover:bg-[#D9D9D9] animate-pulse"
					>
						<div className="flex items-center gap-5">
							<div className="w-[70px] h-[70px] bg-gray-200 rounded" />
							<div className="flex flex-col gap-2">
								<div className="h-4 bg-gray-200 rounded w-32" />
								<div className="h-3 bg-gray-200 rounded w-24" />
							</div>
						</div>
						<div className="flex gap-2">
							<div className="h-6 bg-gray-200 rounded w-16" />
							<div className="h-6 bg-gray-200 rounded w-16" />
						</div>
					</div>
				))}
			</div>
		),
		[],
	);

	return (
		<>
			{/* Filters / Sort / Search */}
			<div className="mb-3">
				<div className="flex justify-between items-center w-full">
					<ArtistProductFilter onFilterChange={handleFiltersChange} />
					<ProductSort onSortChange={handleSortChange} />
				</div>
				<ProductSearch onSearch={handleSearch} />
			</div>

			{/* Product List */}
			<div className="flex flex-col gap-2.5 mb-3 mt-3">
				{isLoading ? (
					renderSkeleton
				) : isError ? (
					<div className="text-center py-8 text-gray-500">트랙을 불러오는데 실패했습니다.</div>
				) : filteredProducts.length === 0 ? (
					<div className="text-center py-8 text-gray-500">검색 결과가 없습니다.</div>
				) : (
					filteredProducts.map((product) => (
						<ProductItem
							key={product.id}
							productId={product.id.toString()}
							title={product.productName}
							artist={product.seller?.stageName}
							albumImgSrc={product.coverImage?.url}
							tags={product.tags ? (product.tags as any).map((t: any) => (typeof t === "string" ? t : t.name)) : []}
							type={product.category as any}
						/>
					))
				)}

				{/* Infinite Scroll Trigger */}
				{hasNextPage && (
					<div
						ref={loadMoreRef}
						className="h-4"
					/>
				)}

				{/* Additional Skeleton while fetching */}
				{isFetchingNextPage && renderSkeleton}
			</div>
		</>
	);
});

ArtistProductList.displayName = "ArtistProductList";
