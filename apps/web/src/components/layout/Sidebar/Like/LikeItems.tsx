import { cn } from "@/common/utils";
import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { memo, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import LikeItem from "./LikeItem";
import { getLikedProductsInfiniteListQueryOption, getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { useAuthStore } from "@/stores/auth";
import { useShallow } from "zustand/react/shallow";
import { ProductRowByDashboardResponse } from "@hitbeatclub/shared-types";

interface LikeItemsProps {
	search?: string;
	sort?: "RECENT" | "NAME";
}

/**
 * 좋아요한 아이템들을 무한스크롤로 표시하는 컴포넌트
 * - TanStack Query Infinite Query와 react-intersection-observer 활용
 * - useMemo를 통한 데이터 메모이제이션
 * - 로딩 상태 및 에러 처리
 */
const LikeItems = memo(({ search, sort }: LikeItemsProps) => {
	// Rules of Hooks: 모든 hook을 최상위에서 호출
	const { data: userMe, isSuccess: isUserMeSuccess } = useQuery({
		...getUserMeQueryOption(),
	});

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery({
		...getLikedProductsInfiniteListQueryOption(userMe?.id || 0, {
			sort: sort || "RECENT",
			search: search,
		}),
		placeholderData: keepPreviousData,
		enabled: isUserMeSuccess && !!userMe?.id,
	});

	// 더 TanStack Query스럽게 데이터 처리 - useMemo로 메모이제이션
	const likedProducts = useMemo<ProductRowByDashboardResponse[]>(() => {
		if (!data?.pages) return [];
		return data.pages.flat();
	}, [data?.pages]);

	// react-intersection-observer를 사용한 무한스크롤
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

	// 로딩 중일 때 표시할 스켈레톤 UI
	const renderSkeleton = useMemo(
		() => (
			<div className="flex flex-col gap-10px">
				{Array.from({ length: 3 }).map((_, index) => (
					<div
						key={index}
						className="flex items-center gap-16px w-52px h-52px @200px/sidebar:w-280px @200px/sidebar:h-42px animate-pulse"
					>
						<div className="w-52px @200px/sidebar:w-40px h-full bg-gray-200 rounded-5px flex-shrink-0" />
						<div className="hidden @200px/sidebar:flex flex-col gap-2 flex-1">
							<div className="h-4 bg-gray-200 rounded w-3/4" />
							<div className="h-3 bg-gray-200 rounded w-1/2" />
						</div>
					</div>
				))}
			</div>
		),
		[],
	);

	// 추가 로딩 스켈레톤 UI
	const renderLoadMoreSkeleton = useMemo(
		() => (
			<div className="flex flex-col gap-10px mt-2">
				{Array.from({ length: 2 }).map((_, index) => (
					<div
						key={`loading-${index}`}
						className="flex items-center gap-16px w-52px h-52px @200px/sidebar:w-280px @200px/sidebar:h-42px animate-pulse"
					>
						<div className="w-52px @200px/sidebar:w-40px h-full bg-gray-200 rounded-5px flex-shrink-0" />
						<div className="hidden @200px/sidebar:flex flex-col gap-2 flex-1">
							<div className="h-4 bg-gray-200 rounded w-3/4" />
							<div className="h-3 bg-gray-200 rounded w-1/2" />
						</div>
					</div>
				))}
			</div>
		),
		[],
	);

	// 컨테이너 스타일 메모이제이션
	const containerClassName = useMemo(
		() =>
			cn(
				"gap-1 h-full mt-3px py-6px overflow-y-auto",
				"flex flex-col flex-1 gap-10px content-start",
				"transition-all duration-300",
				"ml-20px @200px/sidebar:ml-0px",
				"@200px/sidebar:w-300px w-135px pl-2",
				"@200px/sidebar:overflow-x-hidden overflow-x-auto",
			),
		[],
	);

	// userId가 없으면 빈 상태 표시
	if (!isUserMeSuccess || !userMe?.id) {
		// return <div className="flex items-center justify-center h-full text-gray-500">로그인이 필요합니다.</div>;
		return null;
	}

	// 에러 상태
	if (isError) {
		return (
			<div className="flex items-center justify-center h-full text-gray-500">
				좋아요한 아이템을 불러오는데 실패했습니다.
			</div>
		);
	}

	// 로딩 상태
	if (isLoading) {
		return <div className={containerClassName}>{renderSkeleton}</div>;
	}

	// 데이터가 없을 때
	if (likedProducts.length === 0) {
		return <div className={containerClassName} />;
	}

	return (
		<div className={containerClassName}>
			{likedProducts.map((item) => (
				<LikeItem
					key={item.id}
					track={item}
				/>
			))}

			{/* 무한스크롤 트리거 - react-intersection-observer 사용 */}
			{hasNextPage && (
				<div
					ref={loadMoreRef}
					className="h-4"
				/>
			)}

			{/* 더 불러오는 중일 때 로딩 스켈레톤 */}
			{isFetchingNextPage && renderLoadMoreSkeleton}
		</div>
	);
});

LikeItems.displayName = "LikeItems";
export default LikeItems;
