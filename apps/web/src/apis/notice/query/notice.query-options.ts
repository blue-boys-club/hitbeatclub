import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import { NoticeListQueryRequest } from "@hitbeatclub/shared-types/notice";
import { QUERY_KEYS } from "../../query-keys";
import { getNoticeList, getNoticeDetail } from "../notice.api";

export const getNoticeListQueryOption = (payload: NoticeListQueryRequest) => {
	return queryOptions({
		queryKey: QUERY_KEYS.notice.list(payload),
		queryFn: () => getNoticeList(payload),
		select: (response) => response,
	});
};

export const getNoticeDetailQueryOption = (noticeId: string) => {
	return queryOptions({
		queryKey: QUERY_KEYS.notice.detail(noticeId),
		queryFn: () => getNoticeDetail(noticeId),
		select: (response) => response,
	});
};
