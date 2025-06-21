import { Notice, NoticeListResponse } from "@/apis/notice/notice.type";

export type SortOption = "TITLE" | "CONTENT";

export interface NoticeSearchBarProps {
	searchValue: string;
	setSearchValue: (value: string) => void;
	selectedSort: SortOption;
	setSelectedSort: (sort: SortOption) => void;
	onSearch?: () => void;
}

export interface NoticeListProps {
	data: NoticeListResponse;
	currentPage?: number;
	onPageChange?: (page: number) => void;
}

export interface NoticeDetailHeaderProps {
	data: Notice;
}

export interface NoticeDetailContentProps {
	data: Notice;
	onDelete: () => void;
}

export interface NoticeEditHeaderProps {
	title: string;
	setTitle: (title: string) => void;
}

export interface NoticeEditContentProps {
	data: Notice;
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
