import { queryOptions } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/apis/query-keys";
import { getNoticeDetail, getNoticeList } from "../notice.api";
import { NoticeListQueryRequest } from "@hitbeatclub/shared-types";

export const useNoticeListQueryOptions = (payload: NoticeListQueryRequest) => {
	return queryOptions({
		queryKey: QUERY_KEYS.notice.list(payload),
		queryFn: () => getNoticeList(payload),
	});
};

export const useNoticeDetailQueryOptions = (id: string) => {
	return queryOptions({
		queryKey: QUERY_KEYS.notice.detail(id),
		queryFn: () => getNoticeDetail(id),
	});
};
