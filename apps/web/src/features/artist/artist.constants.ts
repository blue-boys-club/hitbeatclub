import type { SortOptionType } from "./artist.types";

export const SORT_OPTIONS: SortOptionType[] = [
	{ label: "Recent", value: "RECENT" },
	{ label: "A-Z", value: "NAME" },
	{ label: "Popular", value: "POPULAR" },
] as const;
