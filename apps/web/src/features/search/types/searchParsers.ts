import { createSearchParamsCache, parseAsArrayOf, parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs/server";

export enum SortEnum {
	RECENT = "RECENT",
	RECOMMEND = "RECOMMEND",
	null = "null",
}

export const searchQueryParsers = {
	// Page and limit for pagination
	page: parseAsInteger.withDefault(1),
	limit: parseAsInteger.withDefault(10),

	// Search keyword
	keyword: parseAsString.withDefault(""),

	// Filters
	category: parseAsString.withDefault(""),
	sort: parseAsStringEnum<SortEnum>(Object.values(SortEnum)),
	genreIds: parseAsArrayOf(parseAsInteger).withDefault([]),
	tagIds: parseAsArrayOf(parseAsInteger).withDefault([]),
	musicKey: parseAsString,
	scaleType: parseAsString,
	minBpm: parseAsInteger,
	maxBpm: parseAsInteger,
};

export const searchQueryCache = createSearchParamsCache(searchQueryParsers);
