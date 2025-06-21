import { queryOptions } from "@tanstack/react-query";
import { NoticePayload } from "../notice.type";
import { QUERY_KEYS } from "@/apis/query-keys";
import { getNoticeDetail, getNoticeList } from "../notice.api";

export const useNoticeListQueryOptions = (payload: NoticePayload) => {
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
