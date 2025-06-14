import { createSearchParamsCache, parseAsArrayOf, parseAsString, parseAsStringEnum, parseAsInteger } from "nuqs/server";

// 필터 상태 관리를 위한 nuqs 파서 정의
export enum FilterStatusEnum {
	ALL = "all",
	PUBLIC = "public",
	PRIVATE = "private",
	// SOLD = "sold", // TODO: 판매완료 필터 구현 예정
}

export enum SortEnum {
	RECENT = "RECENT",
	RECOMMEND = "RECOMMEND",
	// TODO: Add more sort options as needed
}

export const artistProductQueryParsers = {
	status: parseAsStringEnum<FilterStatusEnum>(Object.values(FilterStatusEnum)).withDefault(FilterStatusEnum.ALL),
	sort: parseAsStringEnum<SortEnum>(Object.values(SortEnum)).withDefault(SortEnum.RECENT),
	search: parseAsString.withDefault(""),
	// tags: parseAsArrayOf(parseAsString).withDefault([]),
	tagIds: parseAsArrayOf(parseAsInteger).withDefault([]),
	category: parseAsString.withDefault(""),
	// genreIds: parseAsString.withDefault(""),
	genreIds: parseAsArrayOf(parseAsInteger).withDefault([]),
	musicKey: parseAsString.withDefault(""),
	scaleType: parseAsString.withDefault(""),
	minBpm: parseAsInteger.withDefault(0),
	maxBpm: parseAsInteger.withDefault(0),
	page: parseAsInteger.withDefault(1),
	limit: parseAsInteger.withDefault(10),
};

export const artistProductQueryCache = createSearchParamsCache(artistProductQueryParsers);
