import { z } from "zod";

export const AuthLoginResponseSchema = z.object({
	userId: z.number().describe("사용자 ID").default(1),
	accessToken: z
		.string()
		.describe("액세스 토큰")
		.default(
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
		),
	refreshToken: z
		.string()
		.describe("리프레시 토큰")
		.default(
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.refresh_token_example",
		),
	email: z.string().email().describe("이메일 주소").default("user@example.com"),
	phoneNumber: z.string().describe("전화번호").default("01012345678"),
});

export const AuthFindIdResponseSchema = z.object({
	email: z.string().email().describe("이메일 주소").default("user@example.com"),
});

export const AuthCheckEmailResponseSchema = z.object({
	success: z.boolean().describe("이메일 중복 확인 성공 여부"),
});

export type AuthLoginResponse = z.infer<typeof AuthLoginResponseSchema>;
export type AuthFindIdResponse = z.infer<typeof AuthFindIdResponseSchema>;
export type AuthCheckEmailResponse = z.infer<typeof AuthCheckEmailResponseSchema>;
