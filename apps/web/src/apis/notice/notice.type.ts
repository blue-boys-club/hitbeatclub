import { CommonResponse, PaginationResponse } from "../api.type";

export interface NoticePayload {
	page?: number;
	limit?: number;
	search?: string;
	searchType?: string;
}

export type NoticeListResponse = PaginationResponse<Notice[]>;

export type NoticeDetailResponse = CommonResponse<Notice>;

export type NoticeUpdateResponse = CommonResponse<{ id: number }>;

export type UploadFileResponse = CommonResponse<{ id: number; url: string }>;

export type NoticeCreateResponse = CommonResponse<{ id: number }>;

export interface Notice {
	id: string;
	title: string;
	content: string;
	viewCount: number;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	files: NoticeFile[];
}

export interface NoticeFile {
	id: string;
	url: string;
	originalName: string;
	type: string; // 예: "NOTICE_FILE"
}

export interface NoticeUpdatePayload {
	title: string;
	content: string;
	noticeFileIds: number[];
}

export interface UploadFilePayload {
	type: "NOTICE_FILE";
	file: File;
}

export interface NoticeCreatePayload {
	title: string;
	content: string;
	noticeFileIds: number[];
}
