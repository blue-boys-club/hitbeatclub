import { z } from "zod";

export const InquiryCreateSchema = z.object({
	name: z.string().min(1, "이름을 입력해주세요.").max(100, "이름은 100자 이내로 입력해주세요."),
	email: z.string().email("유효한 이메일 주소를 입력해주세요.").max(255, "이메일은 255자 이내로 입력해주세요."),
	phoneNumber: z.string().max(20, "휴대폰 번호는 20자 이내로 입력해주세요.").optional(),
	content: z.string().min(1, "문의 내용을 입력해주세요."),
});

export const InquiryUpdateSchema = z.object({
	name: z.string().min(1, "이름을 입력해주세요.").max(100, "이름은 100자 이내로 입력해주세요.").optional(),
	email: z
		.string()
		.email("유효한 이메일 주소를 입력해주세요.")
		.max(255, "이메일은 255자 이내로 입력해주세요.")
		.optional(),
	phoneNumber: z.string().max(20, "휴대폰 번호는 20자 이내로 입력해주세요.").optional(),
	content: z.string().min(1, "문의 내용을 입력해주세요.").optional(),
});

export type InquiryCreateRequest = z.infer<typeof InquiryCreateSchema>;
export type InquiryUpdateRequest = z.infer<typeof InquiryUpdateSchema>;
