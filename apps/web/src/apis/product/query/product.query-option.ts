import {
	getProduct,
	getProductList,
	getProductListForDashboard,
	getProductSearchInfo,
	getProductFileDownloadLink,
	getProductsByIds,
} from "@/apis/product/product.api";
import { QUERY_KEYS } from "@/apis/query-keys";
import { ProductListQueryRequest } from "@hitbeatclub/shared-types/product";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { PRODUCT_FILE_TYPE } from "../product.type";

export const getProductListQueryOption = (payload: ProductListQueryRequest) => {
	return queryOptions({
		queryKey: QUERY_KEYS.products.list(payload),
		queryFn: () => getProductList(payload),
		select: (response) => response.data,
	});
};

export const getProductListInfiniteQueryOption = (payload: ProductListQueryRequest) => {
	const { page: _p, limit: _l, ...queryPayload } = payload;
	return infiniteQueryOptions({
		queryKey: QUERY_KEYS.products.infiniteList(queryPayload),
		queryFn: ({ pageParam }) => getProductList(pageParam as ProductListQueryRequest),
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
			};
		},
		initialPageParam: {
			...payload,
			page: 1,
		},
	});
};

export const getProductQueryOption = (productId: number) => {
	return queryOptions({
		queryKey: QUERY_KEYS.products.one(productId),
		queryFn: () => getProduct(productId),
		select: (response) => response.data,
	});
};

export const getProductSearchInfoQueryOption = () => {
	return queryOptions({
		queryKey: QUERY_KEYS.products.searchInfo,
		queryFn: () => getProductSearchInfo(),
		select: (response) => response.data,
	});
};

export const getProductListForDashboardQueryOption = () => {
	return queryOptions({
		queryKey: QUERY_KEYS.products.dashboard,
		queryFn: () => getProductListForDashboard(),
		select: (response) => response.data,
	});
};

export const getProductFileDownloadLinkQueryOption = (productId: number, type: PRODUCT_FILE_TYPE) => {
	return queryOptions({
		queryKey: QUERY_KEYS.products.fileDownloadLink(productId, type),
		queryFn: () => getProductFileDownloadLink(productId, type),
		select: (response) => response.data,
		// 오디오 파일 URL은 1시간 만료 서명 URL이다.
		// 1시간보다 약간 짧은 50분을 staleTime 으로 두어 만료 직전에만 새로고침할 수 있도록 하고,
		// 포커스 전환/재연결/마운트 시점의 자동 refetch 는 모두 막는다.
		staleTime: 50 * 60 * 1000, // 50 minutes
		gcTime: 55 * 60 * 1000, // 55 minutes (before 1 hour)
		// do not refetch via automatic refetching
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchOnMount: false,
	});
};

export const getProductsByIdsQueryOption = (productIds: number[]) => {
	return queryOptions({
		queryKey: QUERY_KEYS.products.ids(productIds),
		queryFn: () => getProductsByIds(productIds),
		select: (response) => response.data,
	});
};
