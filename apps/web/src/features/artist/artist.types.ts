export enum ViewType {
	GRID = "GRID",
	LIST = "LIST",
}

export type SortOption = "Recent" | "A-Z" | "Popular";

export interface SortOptionType {
	label: string;
	value: string;
}

export interface Artist {
	id: string;
	name: string;
	image: string;
	followers: number;
	isFollowing: boolean;
}

export interface ArtistCardProps {
	activeView: ViewType;
	artists: Artist[];
}

export interface ArtistSearchBarProps {
	activeView: ViewType;
	setActiveView: (view: ViewType) => void;
	selectedSort: SortOption;
	setSelectedSort: (sort: SortOption) => void;
	searchValue: string;
	setSearchValue: (value: string) => void;
}
