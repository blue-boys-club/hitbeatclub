"use client";

import { usePathname } from "next/navigation";
import { useQueryState, useQueryStates, type Options } from "nuqs";
import { artistProductQueryParsers } from "../types/artistProductParsers";

export const useArtistProductParametersStates = (options?: Options) => {
	const pathname = usePathname();
	const isArtistStudio = pathname.includes("/artist-studio");

	return useQueryStates(artistProductQueryParsers, {
		shallow: !isArtistStudio,
		clearOnDefault: true,
		throttleMs: isArtistStudio ? 200 : Infinity,
		...options,
	});
};

export const useArtistProductParametersStateByKey = (
	key: keyof typeof artistProductQueryParsers,
	options?: Options,
) => {
	const pathname = usePathname();
	const isArtistStudio = pathname.includes("/artist-studio");

	return useQueryState(
		key,
		artistProductQueryParsers[key].withOptions({
			shallow: !isArtistStudio,
			clearOnDefault: true,
			throttleMs: isArtistStudio ? 200 : Infinity,
			...options,
		}),
	);
};
