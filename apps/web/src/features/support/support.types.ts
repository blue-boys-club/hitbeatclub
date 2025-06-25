import { InquiryDetailResponse, InquiryListResponse } from "@hitbeatclub/shared-types";

export type InquirySortOption = "name" | "date";

export interface InquirySearchBarProps {
	searchValue: string;
	setSearchValue: (value: string) => void;
	selectedSort: InquirySortOption;
	setSelectedSort: (sort: InquirySortOption) => void;
	onSearch?: () => void;
}

export interface InquiryListProps {
	data: InquiryListResponse;
	currentPage?: number;
	onPageChange?: (page: number) => void;
}

export interface InquiryDetailHeaderProps {
	data: InquiryDetailResponse;
}

export interface InquiryDetailContentProps {
	data: InquiryDetailResponse;
	onDelete: () => void;
}
