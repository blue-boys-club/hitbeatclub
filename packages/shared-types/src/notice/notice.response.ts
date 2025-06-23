import { z } from "zod";
import { CommonResponsePagingSchema } from "../common/common.response";

// 공지사항 파일 스키마
export const NoticeFileResponseSchema = z.object({
	id: z.string().describe("파일 ID"),
	url: z.string().describe("파일 URL"),
	originalName: z.string().describe("원본 파일명"),
	type: z.string().describe("파일 타입"),
});

// 공지사항 목록 응답 스키마
export const NoticeListResponseSchema = z.object({
	id: z.string().describe("공지사항 ID"),
	title: z.string().describe("제목"),
	content: z.string().describe("내용"),
	isPublic: z.boolean().describe("공개 여부"),
	isPinned: z.boolean().describe("상단 고정 여부"),
	viewCount: z.number().describe("조회수"),
	createdAt: z.date().describe("생성일"),
	updatedAt: z.date().describe("수정일"),
	files: z.array(NoticeFileResponseSchema).optional().describe("첨부파일 목록"),
});

export const NoticeListPagingResponseSchema = CommonResponsePagingSchema.extend({
	data: z.array(NoticeListResponseSchema),
});

// 공지사항 상세 응답 스키마
export const NoticeDetailResponseSchema = z.object({
	id: z.string().describe("공지사항 ID"),
	title: z.string().describe("제목"),
	content: z.string().describe("내용"),
	isPublic: z.boolean().describe("공개 여부"),
	isPinned: z.boolean().describe("상단 고정 여부"),
	viewCount: z.number().describe("조회수"),
	createdAt: z.date().describe("생성일"),
	updatedAt: z.date().describe("수정일"),
	files: z.array(NoticeFileResponseSchema).optional().describe("첨부파일 목록"),
});

// 공지사항 생성/수정 응답 스키마
export const NoticeCreateResponseSchema = z.object({
	id: z.string().describe("생성된 공지사항 ID"),
});

// 타입 추출
export type NoticeFileResponse = z.infer<typeof NoticeFileResponseSchema>;
export type NoticeListResponse = z.infer<typeof NoticeListResponseSchema>;
export type NoticeDetailResponse = z.infer<typeof NoticeDetailResponseSchema>;
export type NoticeCreateResponse = z.infer<typeof NoticeCreateResponseSchema>;
export type NoticeListPagingResponse = z.infer<typeof NoticeListPagingResponseSchema>;
