"use client";

import { parseAsArrayOf, parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs";
import { createSearchParamsCache } from "nuqs/server";

export enum LikeSortEnum {
	RECENT = "RECENT",
	NAME = "NAME",
}

export const productLikeFilterQueryParsers = {
	sort: parseAsStringEnum<LikeSortEnum>(Object.values(LikeSortEnum)).withDefault(LikeSortEnum.RECENT),
	search: parseAsString.withDefault(""),
	tagIds: parseAsArrayOf(parseAsInteger).withDefault([]),
	category: parseAsString.withDefault(""),
	genreIds: parseAsArrayOf(parseAsInteger).withDefault([]),
	musicKey: parseAsString.withDefault(""),
	scaleType: parseAsString.withDefault(""),
	minBpm: parseAsInteger.withDefault(0),
	maxBpm: parseAsInteger.withDefault(0),
};

export const productLikeFilterQueryCache = createSearchParamsCache(productLikeFilterQueryParsers);
