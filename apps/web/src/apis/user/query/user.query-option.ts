import { QUERY_KEYS } from "@/apis/query-keys";
import { useAuthStore } from "@/stores/auth";
import { getLikedProducts, getUserMe } from "../user.api";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { UserLikeProductListRequest, UserLikeProductListRequestSchema } from "@hitbeatclub/shared-types/user";

/**
 * 유저 정보 조회
 * @returns 유저 정보
 */
export const getUserMeQueryOption = () => {
	const userId = useAuthStore.getState().user?.userId;

	return queryOptions({
		queryKey: QUERY_KEYS.user.me,
		queryFn: () => getUserMe(),
		select: (response) => response.data,
		enabled: !!userId,
	});
};

/**
 * 좋아요 상품 조회
 * @param userId 유저 아이디
 * @returns 좋아요 상품 목록
 */
export const getLikedProductsQueryOption = (userId: number, payload: UserLikeProductListRequest) => {
	return queryOptions({
		queryKey: QUERY_KEYS.user.likedProducts(userId, payload),
		queryFn: () => getLikedProducts(userId, payload),
		select: (response) => response.data,
		enabled: !!userId,
	});
};

/**
 * 좋아요 상품 infinite query option
 * @param userId 유저 아이디
 * @param payload 좋아요 상품 목록 요청 페이로드
 * @returns 좋아요 상품 목록
 */
export const getLikedProductsInfiniteListQueryOption = (
	userId: number,
	payload: Omit<UserLikeProductListRequest, "page" | "limit">,
) => {
	return infiniteQueryOptions({
		queryKey: QUERY_KEYS.user.infiniteLikedProducts(userId, payload),
		queryFn: ({ pageParam }) => getLikedProducts(userId, pageParam as UserLikeProductListRequest),
		select: (response) => ({
			pages: response.pages.map((page) => page.data),
			pageParams: response.pageParams,
		}),
		getNextPageParam: (lastPage) => {
			const nextPage = lastPage._pagination.page + 1;
			const totalPages = Math.ceil(lastPage._pagination.total / lastPage._pagination.limit);

			if (nextPage > totalPages) {
				return undefined;
			}

			return {
				...payload,
				page: nextPage,
				limit: 10,
			};
		},
		initialPageParam: {
			...payload,
			page: 1,
			limit: 10,
		},
		enabled: !!userId,
	});
};
