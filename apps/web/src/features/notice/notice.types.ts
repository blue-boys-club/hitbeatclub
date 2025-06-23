import { NoticeDetailResponse, NoticeListPagingResponse } from "@hitbeatclub/shared-types";

export type SortOption = "title" | "date" | "view";

export interface NoticeSearchBarProps {
	searchValue: string;
	setSearchValue: (value: string) => void;
	selectedSort: SortOption;
	setSelectedSort: (sort: SortOption) => void;
	onSearch?: () => void;
}

export interface NoticeListProps {
	data: NoticeListPagingResponse;
	currentPage?: number;
	onPageChange?: (page: number) => void;
}

export interface NoticeDetailHeaderProps {
	data: NoticeDetailResponse;
}

export interface NoticeDetailContentProps {
	data: NoticeDetailResponse;
	onDelete: () => void;
}

export interface NoticeEditHeaderProps {
	title: string;
	setTitle: (title: string) => void;
}

export interface NoticeEditContentProps {
	data: NoticeDetailResponse;
	onUpdate: () => void;
	setContent: (content: string) => void;
	content: string;
	uploadedFileIds: number[];
	setUploadedFileIds: (fileIds: number[]) => void;
}

export interface NoticeCreateHeaderProps {
	title: string;
	setTitle: (title: string) => void;
}

export interface NoticeCreateContentProps {
	content: string;
	setContent: (content: string) => void;
	uploadedFileIds: number[];
	setUploadedFileIds: (fileIds: number[]) => void;
	onCreateNotice: () => void;
}

export interface UploadedFile {
	id: number;
	url: string;
	name: string;
}
