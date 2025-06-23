import { getInquiryDetail, getInquiryList } from "../inquiry.api";
import { queryOptions } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/apis/query-keys";

export const getInquiryListQueryOption = () => {
	return queryOptions({
		queryKey: QUERY_KEYS.inquiry.list,
		queryFn: getInquiryList,
		select: (response) => response.data,
	});
};

export const getInquiryDetailQueryOption = (id: number) => {
	return queryOptions({
		queryKey: QUERY_KEYS.inquiry.detail(id),
		queryFn: () => getInquiryDetail(id),
		select: (response) => response.data,
	});
};
