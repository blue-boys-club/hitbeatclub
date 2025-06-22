import { QUERY_KEYS } from "@/apis/query-keys";
import { getPlayerList } from "../player.api";
import { PaginationRequest } from "@hitbeatclub/shared-types/common";
import { PaymentOrderResponse } from "@hitbeatclub/shared-types/payment";
import { CommonResponse, PaginationResponse } from "@/apis/api.type";
import { InfiniteData, infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

/**
 * 플레이어 목록 조회 옵션
 * @param payload 페이지네이션 요청 데이터
 * @returns 플레이어 목록 조회 옵션
 */
export const getPlayerListQueryOptions = (payload: PaginationRequest) =>
	queryOptions({
		queryKey: QUERY_KEYS.player.list(payload),
		queryFn: () => getPlayerList(payload),
		select: (data) => data.data,
	});

/**
 * 플레이어 목록 무한 조회 옵션
 * @returns 플레이어 목록 무한 조회 옵션
 */
export const getPlayerListInfiniteQueryOptions = () =>
	infiniteQueryOptions({
		queryKey: QUERY_KEYS.player.infiniteList,
		queryFn: ({ pageParam }) => getPlayerList(pageParam as PaginationRequest),
		select: (data) => ({
			pages: data.pages.map((page) => page.data),
			pageParams: data.pageParams,
		}),
		getNextPageParam: (lastPage) => {
			const nextPage = lastPage._pagination.page + 1;
			const totalPages = Math.ceil(lastPage._pagination.total / lastPage._pagination.limit);

			if (nextPage > totalPages) {
				return undefined;
			}

			return {
				page: nextPage,
				limit: 10,
			};
		},
		initialPageParam: {
			page: 1,
			limit: 10,
		},
	});
