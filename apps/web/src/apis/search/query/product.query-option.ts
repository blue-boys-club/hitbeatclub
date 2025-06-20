import { getSearch } from "@/apis/search/search.api";
import { QUERY_KEYS } from "@/apis/query-keys";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { ProductSearchQuery } from "../search.type";

export const getSearchQueryOption = (payload: ProductSearchQuery) => {
	return queryOptions({
		queryKey: QUERY_KEYS.search.list(payload),
		queryFn: () => getSearch(payload),
		select: (response) => response.data,
	});
};

export const getSearchInfiniteQueryOption = (payload: Omit<ProductSearchQuery, "page" | "limit">) => {
	return infiniteQueryOptions({
		queryKey: QUERY_KEYS.search.infiniteList(payload as ProductSearchQuery),
		queryFn: ({ pageParam }) => getSearch(pageParam as ProductSearchQuery),
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
	});
};
