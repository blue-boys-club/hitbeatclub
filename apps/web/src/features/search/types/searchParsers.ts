import { createSearchParamsCache, parseAsArrayOf, parseAsString, parseAsStringEnum } from "nuqs/server";

export enum SortEnum {
	Recent = "Recent",
	A_Z = "A-Z",
	Popular = "Popular",
}

export const searchQueryParsers = {
	search: parseAsString,
	tags: parseAsArrayOf(parseAsString).withDefault([]),
	category: parseAsString.withDefault(""),
	genre: parseAsString.withDefault(""),
	key: parseAsString.withDefault(""),
	bpm: parseAsString.withDefault(""),
	sort: parseAsStringEnum<SortEnum>(Object.values(SortEnum)).withDefault(SortEnum.Recent),
};

export const searchQueryCache = createSearchParamsCache(searchQueryParsers);
