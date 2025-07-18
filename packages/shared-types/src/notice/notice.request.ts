import { z } from "zod";

export enum NOTICE_SORT_TYPE {
	TITLE = "title",
	DATE = "date",
	VIEW = "view",
}

export const NOTICE_SORT_TYPE_VALUES = Object.values(NOTICE_SORT_TYPE) as [string, ...string[]];

// 공지사항 생성 스키마
export const NoticeCreateRequestSchema = z.object({
	title: z.string().min(1, "제목을 입력해주세요.").default("공지드립니다.").describe("공지사항 제목"),
	content: z.string().min(1, "내용을 입력해주세요.").default("내용을 입력해주세요.").describe("공지사항 내용"),
	noticeFileIds: z.array(z.number()).optional().default([]).describe("첨부파일 IDs"),
});

// 공지사항 수정 스키마
export const NoticeUpdateRequestSchema = NoticeCreateRequestSchema.partial();

// 공지사항 목록 조회 스키마
export const NoticeListQueryRequestSchema = z.object({
	page: z.coerce.number().min(1).describe("1"),
	limit: z.coerce.number().min(1).describe("10"),
	search: z.string().optional().describe("검색어 (제목, 내용)"),
	sort: z
		.enum(NOTICE_SORT_TYPE_VALUES)
		.optional()
		.describe("정렬 기준 (title: 제목순, date: 날짜순, view: 조회순)")
		.default("date"),
});

// 공지사항 파일 업로드 스키마
export const NoticeUploadFileRequestSchema = z.object({
	type: z.enum(["image", "document"]).describe("파일 타입"),
	file: z.any().describe("업로드할 파일"),
});

// 타입 추출
export type NoticeCreateRequest = z.infer<typeof NoticeCreateRequestSchema>;
export type NoticeUpdateRequest = z.infer<typeof NoticeUpdateRequestSchema>;
export type NoticeListQueryRequest = z.infer<typeof NoticeListQueryRequestSchema>;
export type NoticeUploadFileRequest = z.infer<typeof NoticeUploadFileRequestSchema>;
