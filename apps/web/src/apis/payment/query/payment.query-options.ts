import { QUERY_KEYS } from "@/apis/query-keys";
import { getOrder, getUserOrders } from "../payment.api";
import { PaginationRequest } from "@hitbeatclub/shared-types/common";
import { PaymentOrderResponse } from "@hitbeatclub/shared-types/payment";
import { CommonResponse, PaginationResponse } from "@/apis/api.type";
import { InfiniteData, infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

/**
 * 사용자 주문 목록 조회 옵션
 * @param payload 페이지네이션 요청 데이터
 * @returns 주문 목록 조회 옵션
 */
export const getUserOrdersQueryOptions = (payload: PaginationRequest) =>
	queryOptions({
		queryKey: QUERY_KEYS.user.payment.orders(payload),
		queryFn: () => getUserOrders(payload),
		select: (data) => data.data,
	});

/**
 * 사용자 주문 목록 무한 조회 옵션
 * @returns 주문 목록 무한 조회 옵션
 */
export const getUserOrdersInfiniteQueryOptions = () =>
	infiniteQueryOptions({
		queryKey: QUERY_KEYS.user.payment.infiniteOrders,
		queryFn: ({ pageParam }) => getUserOrders(pageParam as PaginationRequest),
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

/**
 * 주문 상세 조회 옵션
 * @param orderNumber 주문 번호
 * @returns 주문 상세 조회 옵션
 */
export const getOrderQueryOptions = (orderNumber: number) =>
	queryOptions({
		queryKey: QUERY_KEYS.user.payment.order(orderNumber),
		queryFn: () => getOrder(orderNumber),
		select: (data: CommonResponse<PaymentOrderResponse>) => data.data,
	});
