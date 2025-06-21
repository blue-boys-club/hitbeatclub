"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getSearchInfiniteQueryOption } from "@/apis/search/query/product.query-option";
import { useSearchParametersStatesWithKeywordDebounced } from "./useSearchParameters";
import type { ProductSearchQuery } from "@/apis/search/search.type";

/**
 * 검색 결과를 위한 인피니트 쿼리 훅
 * URL 파라미터를 자동으로 읽어서 검색 쿼리를 실행합니다
 */
export const useSearchInfiniteQuery = () => {
	const [searchParams] = useSearchParametersStatesWithKeywordDebounced();

	// ProductSearchQuery 타입에 맞게 변환
	const queryPayload: Omit<ProductSearchQuery, "page" | "limit"> = {
		keyword: searchParams.keyword || undefined,
		category: (searchParams.category || undefined) as "BEAT" | "ACAPELA" | "null" | undefined,
		sort: (searchParams.sort || undefined) as "RECENT" | "RECOMMEND" | "null" | undefined,
		genreIds: (searchParams.genreIds.length > 0 ? searchParams.genreIds : undefined) as number[] | undefined,
		tagIds: (searchParams.tagIds.length > 0 ? searchParams.tagIds : undefined) as number[] | undefined,
		musicKey: (searchParams.musicKey || undefined) as
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

	return useInfiniteQuery(getSearchInfiniteQueryOption(queryPayload));
};
