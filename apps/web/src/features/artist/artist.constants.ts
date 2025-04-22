import type { SortOptionType } from "./artist.types";

export const SORT_OPTIONS: SortOptionType[] = [
	{ label: "Recent", value: "Recent" },
	{ label: "A-Z", value: "A-Z" },
	{ label: "Popular", value: "Popular" },
] as const;
