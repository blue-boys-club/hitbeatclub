import { QUERY_KEYS } from "@/apis/query-keys";
import { queryOptions } from "@tanstack/react-query";
import { getTagList } from "../tag.api";

export const getTagListQueryOption = () => {
	return queryOptions({
		queryKey: QUERY_KEYS.tag.list,
		queryFn: getTagList,
	});
};
