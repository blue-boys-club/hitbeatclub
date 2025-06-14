"use client";

import { usePathname } from "next/navigation";
import { useQueryState, useQueryStates, type Options } from "nuqs";
import { productLikeFilterQueryParsers } from "../types/productLikeFilterParsers";

export const useProductLikeFilterParametersStates = (options?: Options) => {
	return useQueryStates(productLikeFilterQueryParsers, {
		shallow: true,
		clearOnDefault: true,
		throttleMs: 200,
		...options,
	});
};

export const useProductLikeFilterParametersStateByKey = (
	key: keyof typeof productLikeFilterQueryParsers,
	options?: Options,
) => {
	return useQueryState(
		key,
		productLikeFilterQueryParsers[key].withOptions({
			shallow: true,
			clearOnDefault: true,
			throttleMs: 200,
			...options,
		}),
	);
};
