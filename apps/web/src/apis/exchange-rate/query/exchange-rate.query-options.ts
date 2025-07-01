import { queryOptions } from "@tanstack/react-query";
import { getExchangeRateLatest } from "../exchange-rate.api";
import { QUERY_KEYS } from "@/apis/query-keys";

export const useExchangeRateLatestQueryOptions = (base: string = "KRW", target: string = "USD") => {
	return queryOptions({
		queryKey: QUERY_KEYS.exchangeRate.latest(base, target),
		queryFn: () => getExchangeRateLatest(base, target),
		select: (data) => data.data,
	});
};
