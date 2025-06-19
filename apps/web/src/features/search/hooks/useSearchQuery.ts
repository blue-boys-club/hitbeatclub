"use client";

import { useQuery } from "@tanstack/react-query";
import { getSearchQueryOption as getSearchQueryOptionFromApi } from "@/apis/search/query/product.query-option";
import { useSearchParametersStates } from "./useSearchParameters";
import type { ProductSearchQuery } from "@/apis/search/search.type";

export const useGetSearchQueryOptions = () => {
	const [searchParams] = useSearchParametersStates();

	// ProductSearchQuery 타입에 맞게 변환
	const queryPayload: ProductSearchQuery = {
		page: searchParams.page,
		limit: searchParams.limit,
		keyword: searchParams.keyword || undefined,
		category: (searchParams.category || undefined) as "BEAT" | "ACAPELA" | "null" | undefined,
		sort: (searchParams.sort || undefined) as "RECENT" | "RECOMMEND" | "null" | undefined,
		genreIds: (searchParams.genreIds.length > 0 ? searchParams.genreIds : undefined) as number[] | undefined,
		tagIds: (searchParams.tagIds.length > 0 ? searchParams.tagIds : undefined) as number[] | undefined,
		musicKey: searchParams.musicKey as
			| "C"
			| "Db"
			| "D"
			| "Eb"
			| "E"
			| "F"
			| "Gb"
			| "G"
			| "Ab"
			| "A"
			| "Bb"
			| "B"
			| "Cs"
			| "Ds"
			| "Fs"
			| "Gs"
			| "As"
			| "null"
			| undefined,
		scaleType: (searchParams.scaleType || undefined) as "MAJOR" | "MINOR" | "null" | undefined,
		minBpm: searchParams.minBpm || undefined,
		maxBpm: searchParams.maxBpm || undefined,
	};

	return getSearchQueryOptionFromApi(queryPayload);
};
