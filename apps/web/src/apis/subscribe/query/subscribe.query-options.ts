import { queryOptions } from "@tanstack/react-query";
import { getSubscribePlans } from "../subscribe.api";
import { QUERY_KEYS } from "@/apis/query-keys";

export const useSubscribePlansQueryOptions = () => {
	return queryOptions({
		queryKey: QUERY_KEYS.subscribe.plans,
		queryFn: getSubscribePlans,
	});
};
