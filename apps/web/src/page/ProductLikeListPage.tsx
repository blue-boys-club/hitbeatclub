"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { useInfiniteQuery, useQuery, keepPreviousData } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { ProductLikeHeader, ProductLikeFilter } from "@/features/product/components";
import { getLikedProductsInfiniteListQueryOption, getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { ProductRowByDashboardResponse } from "@hitbeatclub/shared-types";
import type { UserLikeProductListRequest } from "@hitbeatclub/shared-types/user";
import { ProductItem } from "@/features/product/components";
import { useUnlikeProductMutation } from "@/apis/product/mutations";
import { createPlaylistConfig } from "@/components/layout/PlaylistProvider";

/**
 * 좋아요 페이지의 메인 컴포넌트
 * - 좋아요 페이지 헤더 표시
 * - 트랙 필터링, 정렬, 검색 기능
 * - 좋아요한 트랙 목록을 infinite scroll로 표시
 */
const ProductLikeListPage = memo(() => {
	// 사용자 정보 조회
	const { data: userMe, isSuccess: isUserMeSuccess } = useQuery({
		...getUserMeQueryOption(),
	});

	// 필터 상태 관리
	const [filters, setFilters] = useState<Omit<UserLikeProductListRequest, "page" | "limit">>({
		sort: "RECENT",
	});

	// 필터 변경 핸들러
	const handleFilterChange = useCallback((newFilters: Omit<UserLikeProductListRequest, "page" | "limit">) => {
		setFilters(newFilters);
	}, []);

	// 좋아요 상품 infinite query
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery({
		...getLikedProductsInfiniteListQueryOption(userMe?.id || 0, filters),
		placeholderData: keepPreviousData,
		enabled: isUserMeSuccess && !!userMe?.id,
	});

	// 좋아요 상품 데이터 메모이제이션
	const likedProducts = useMemo<ProductRowByDashboardResponse[]>(() => {
		if (!data?.pages) return [];
		return data.pages.flat();
	}, [data?.pages]);

	// 무한스크롤 설정
	const { ref: loadMoreRef, inView } = useInView({
		threshold: 0,
		rootMargin: "100px",
	});

	// inView가 true가 되면 다음 페이지 로드
	useMemo(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

	// 로딩 스켈레톤 UI
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

	const { mutate: unlikeProduct } = useUnlikeProductMutation();

	const handleLike = useCallback((productId: number) => {
		unlikeProduct(productId, {
			onSuccess: () => {},
		});
	}, []);

	// 현재 필터 기준 자동 플레이리스트 설정
	const playlistConfig = useMemo(() => createPlaylistConfig.liked(filters), [filters]);

	// 사용자 정보가 없으면 null 반환
	if (!isUserMeSuccess || !userMe?.id) {
		return null;
	}

	// 에러 상태
	if (isError) {
		return (
			<div className="flex items-center justify-center h-64 text-gray-500">
				좋아요한 트랙을 불러오는데 실패했습니다.
			</div>
		);
	}

	return (
		<>
			<ProductLikeHeader
				totalCount={data?.pages[0]?.length || 0}
				username={userMe.name}
			/>

			<ProductLikeFilter onFilterChange={handleFilterChange} />

			{/* 좋아요한 트랙 목록 */}
			<div className="flex flex-col gap-2.5 mb-3 mt-3">
				{isLoading ? (
					renderSkeleton
				) : likedProducts.length === 0 ? (
					<div className="text-center py-8 text-gray-500">좋아요한 트랙이 없습니다.</div>
				) : (
					likedProducts.map((product, index) => (
						<ProductItem
							key={product.id}
							type={"BEAT"} // TODO: 타입 추가
							productId={product?.id}
							title={product.productName}
							artist={product.seller?.stageName}
							albumImgSrc={product.coverImage?.url}
							tags={product.tags}
							// genres={product.genres}
							isLiked={true}
							autoPlaylistConfig={playlistConfig}
							trackIndex={index}
							onLike={() => handleLike(product.id)}
						/>
					))
				)}

				{/* 무한스크롤 트리거 */}
				{hasNextPage && (
					<div
						ref={loadMoreRef}
						className="h-4"
					/>
				)}

				{/* 추가 로딩 스켈레톤 */}
				{isFetchingNextPage && (
					<div className="flex flex-col gap-2.5">
						{Array.from({ length: 3 }).map((_, index) => (
							<div
								key={`loading-${index}`}
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
				)}
			</div>
		</>
	);
});

ProductLikeListPage.displayName = "ProductLikeListPage";

export default ProductLikeListPage;
