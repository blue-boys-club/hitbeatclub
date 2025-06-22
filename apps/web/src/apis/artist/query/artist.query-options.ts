import { QUERY_KEYS } from "@/apis/query-keys";
import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import {
	getArtistContentList,
	getArtistContentListBySlug,
	getArtistDetail,
	getArtistDetailBySlug,
	getArtistMe,
} from "../artist.api";
import { ArtistProductListQueryRequest } from "@hitbeatclub/shared-types/artist";

export const getArtistDetailQueryOption = (id: number) => {
	return queryOptions({
		queryKey: QUERY_KEYS.artist.detail(id),
		queryFn: () => getArtistDetail(id),
		select: (response) => response.data,
	});
};

export const getArtistDetailBySlugQueryOption = (slug: string) => {
	return queryOptions({
		queryKey: QUERY_KEYS.artist.detailBySlug(slug),
		queryFn: () => getArtistDetailBySlug(slug),
		select: (response) => response.data,
	});
};

export const getArtistMeQueryOption = () => {
	return queryOptions({
		queryKey: QUERY_KEYS.artist.me,
		queryFn: () => getArtistMe(),
		select: (response) => response.data,
	});
};

export const getArtistProductListQueryOption = (id: number, payload: ArtistProductListQueryRequest) => {
	return queryOptions({
		queryKey: QUERY_KEYS.artist.productList(id, payload),
		queryFn: () => getArtistContentList(id, payload),
		select: (response) => response,
	});
};

export const getArtistProductListBySlugQueryOption = (slug: string, payload: ArtistProductListQueryRequest) => {
	return queryOptions({
		queryKey: QUERY_KEYS.artist.productListBySlug(slug, payload),
		queryFn: () => getArtistContentListBySlug(slug, payload),
		select: (response) => response,
	});
};

export const getArtistProductListBySlugInfiniteQueryOption = (
	slug: string,
	payload: Omit<ArtistProductListQueryRequest, "page" | "limit">,
) => {
	return infiniteQueryOptions({
		queryKey: QUERY_KEYS.artist.infiniteProductListBySlug(slug, payload as ArtistProductListQueryRequest),
		queryFn: ({ pageParam }) => {
			const param = pageParam as ArtistProductListQueryRequest;
			const option = getArtistProductListBySlugQueryOption(slug, param);
			return (option.queryFn as () => Promise<any>)();
		},
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
