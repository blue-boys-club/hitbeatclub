import { z } from "zod";

export const InquiryResponseSchema = z.object({
	id: z.number().describe("문의 ID"),
	name: z.string().describe("이름"),
	email: z.string().describe("이메일 주소"),
	phoneNumber: z.string().nullable().describe("휴대폰 번호"),
	content: z.string().describe("문의 내용"),
	createdAt: z.string().datetime().describe("생성 일시"),
	updatedAt: z.string().datetime().describe("수정 일시"),
});

export const InquiryListResponseSchema = z.array(InquiryResponseSchema);
export const InquiryDetailResponseSchema = InquiryResponseSchema;

export type InquiryResponse = z.infer<typeof InquiryResponseSchema>;
export type InquiryListResponse = z.infer<typeof InquiryListResponseSchema>;
export type InquiryDetailResponse = z.infer<typeof InquiryDetailResponseSchema>;
