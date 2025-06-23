import { z } from "zod";

export const QuestionResponseSchema = z.object({
	id: z.number().describe("질문 ID"),
	title: z.string().describe("질문 제목"),
	content: z.string().describe("질문 내용"),
	createdAt: z.string().datetime().describe("생성 일시"),
	updatedAt: z.string().datetime().describe("수정 일시"),
});

export const QuestionListResponseSchema = z.array(QuestionResponseSchema);

export const QuestionDetailResponseSchema = QuestionResponseSchema;

export type QuestionResponse = z.infer<typeof QuestionResponseSchema>;
export type QuestionListResponse = z.infer<typeof QuestionListResponseSchema>;
export type QuestionDetailResponse = z.infer<typeof QuestionDetailResponseSchema>;
