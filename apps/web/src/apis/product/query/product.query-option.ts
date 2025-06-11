import { getProduct, getProductList, getProductSearchInfo } from "@/apis/product/product.api";
import { QUERY_KEYS } from "@/apis/query-keys";
import { ProductListQueryRequest } from "@hitbeatclub/shared-types/product";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

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
