import { z } from "zod";

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
	searchType: z.string().optional().describe("검색 타입 (title, content)").default("title"),
});

// 공지사항 파일 업로드 스키마
export const NoticeUploadFileRequestSchema = z.object({
	type: z.enum(["image", "document"]).describe("파일 타입"),
});

// 타입 추출
export type NoticeCreateRequest = z.infer<typeof NoticeCreateRequestSchema>;
export type NoticeUpdateRequest = z.infer<typeof NoticeUpdateRequestSchema>;
export type NoticeListQueryRequest = z.infer<typeof NoticeListQueryRequestSchema>;
export type NoticeUploadFileRequest = z.infer<typeof NoticeUploadFileRequestSchema>;
