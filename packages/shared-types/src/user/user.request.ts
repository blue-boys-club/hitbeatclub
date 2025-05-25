import { z } from "zod";

export const UserUpdatePayloadSchema = z.object({
	name: z.string().min(1).max(100).describe("사용자 이름").default("John Doe").optional(),
	password: z.string().min(8).max(255).describe("비밀번호").optional(),
	phoneNumber: z.string().max(20).describe("전화번호").default("010-1234-5678").optional(),
	gender: z.enum(["M", "F"]).describe("성별 (M/F)").default("M").optional(),
	birthDate: z.string().datetime().describe("생년월일").default("1990-01-01T00:00:00Z").optional(),
	profileUrl: z
		.string()
		.url()
		.max(255)
		.describe("프로필 이미지 URL")
		.default("https://example.com/profile.jpg")
		.optional(),
	country: z.string().max(4).describe("국가 코드").default("KR").optional(),
	region: z.string().max(100).describe("지역").default("Seoul").optional(),
	agreedTerms: z.boolean().describe("이용약관 동의 여부").default(false),
	agreedPrivacyPolicy: z.boolean().describe("개인정보처리방침 동의 여부").default(false),
	agreedEmail: z.boolean().describe("이메일 수신 동의 여부").default(false),
});

export type UserUpdatePayload = z.infer<typeof UserUpdatePayloadSchema>;
