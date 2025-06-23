import { z } from "zod";

export const questionStatusEnum = z.enum(["PENDING", "ANSWERED", "CLOSED"]);
export const questionPriorityEnum = z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]);

export const QuestionCreateSchema = z.object({
	title: z.string().min(1, "제목은 필수 입력사항입니다.").max(255).describe("질문 제목"),
	content: z.string().min(1, "내용은 필수 입력사항입니다.").describe("질문 내용"),
});

export const QuestionUpdateSchema = z.object({
	title: z.string().min(1, "제목은 필수 입력사항입니다.").max(255).optional().describe("질문 제목"),
	content: z.string().min(1, "내용은 필수 입력사항입니다.").optional().describe("질문 내용"),
});

export type QuestionCreateRequest = z.infer<typeof QuestionCreateSchema>;
export type QuestionUpdateRequest = z.infer<typeof QuestionUpdateSchema>;
