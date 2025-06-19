"use client";

import { usePathname } from "next/navigation";
import { useQueryState, useQueryStates, type Options } from "nuqs";
import { searchQueryParsers } from "../types/searchParsers";

export const useSearchParametersStates = (options?: Options) => {
	const pathname = usePathname();
	const isSearch = pathname === "/search";

	return useQueryStates(searchQueryParsers, {
		shallow: !isSearch,
		clearOnDefault: true,
		throttleMs: isSearch ? 200 : Infinity,
		...options,
	});
};

export const useSearchParametersStateByKey = (key: keyof typeof searchQueryParsers, options?: Options) => {
	const pathname = usePathname();
	const isSearch = pathname === "/search";

	return useQueryState(
		key,
		searchQueryParsers[key].withOptions({
			shallow: !isSearch,
			clearOnDefault: true,
			throttleMs: isSearch ? 200 : Infinity,
			...options,
		}),
	);
};
