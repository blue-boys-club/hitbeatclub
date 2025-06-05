import { z } from "zod";

/**
 * 공통 응답 스키마
 */
export const CommonResponseSchema = z.object({
	statusCode: z.number().describe("상태 코드").default(200),
	message: z.string().describe("메시지").default("성공 메시지"),
});

export const CommonResponseIdSchema = CommonResponseSchema.extend({
	data: z.object({
		id: z.number(),
	}),
});

/**
 * 공통 페이징 응답 스키마
 */
export const CommonResponsePagingSchema = CommonResponseSchema.extend({
	_pagination: z.object({
		page: z.number().describe("현재 페이지").default(1),
		limit: z.number().describe("페이지당 상품 수").default(10),
		totalPage: z.number().describe("총 페이지 수").default(1),
		total: z.number().describe("총 상품 수").default(0),
	}),
});

export type CommonResponseId = z.infer<typeof CommonResponseIdSchema>;
export type CommonResponse = z.infer<typeof CommonResponseSchema>;
export type CommonResponsePaging = z.infer<typeof CommonResponsePagingSchema>;
