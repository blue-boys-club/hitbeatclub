export enum ViewType {
	GRID = "GRID",
	LIST = "LIST",
}

export type SortOption = "RECENT" | "NAME" | "POPULAR";

export interface SortOptionType {
	label: string;
	value: string;
}

export interface Artist {
	artistId: number;
	stageName: string;
	profileImageUrl: string;
	followerCount: number;
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
