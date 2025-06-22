import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import { NoticeListQueryRequest } from "@hitbeatclub/shared-types/notice";
import { QUERY_KEYS } from "../../query-keys";
import { getNoticeList } from "../notice.api";

export const getNoticeListQueryOption = (payload: NoticeListQueryRequest) => {
	return queryOptions({
		queryKey: QUERY_KEYS.notices.list(payload),
		queryFn: () => getNoticeList(payload),
		select: (response) => response,
	});
};

export const getNoticeListInfiniteQueryOption = (payload: NoticeListQueryRequest) => {
	const { page: _p, limit: _l, ...queryPayload } = payload;
	return infiniteQueryOptions({
		queryKey: QUERY_KEYS.notices.infiniteList(queryPayload),
		queryFn: ({ pageParam }) => getNoticeList(pageParam as NoticeListQueryRequest),
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
