import { z } from "zod";

export const AuthLoginPayloadSchema = z.object({
	email: z.string().email().describe("이메일"),
	password: z.string().min(8).max(255).describe("비밀번호"),
});

export const AuthResetPasswordPayloadSchema = z
	.object({
		email: z.string().email().describe("이메일"),
		token: z.string().describe("인증 토큰 해시"),
		newPassword: z.string().min(8).max(255).describe("새 비밀번호"),
		confirmPassword: z.string().min(8).max(255).describe("새 비밀번호 확인"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "새 비밀번호와 확인 비밀번호가 일치하지 않습니다",
		path: ["confirmPassword"],
	});

export const AuthFindIdPayloadSchema = z.object({
	name: z.string().min(1).max(100).describe("이름"),
	phoneNumber: z.string().min(1).max(11).describe("연락처"),
});

export const AuthCheckEmailRequestSchema = z.object({
	email: z.string().email().describe("이메일"),
});

export type AuthLoginPayload = z.infer<typeof AuthLoginPayloadSchema>;
export type AuthResetPasswordPayload = z.infer<typeof AuthResetPasswordPayloadSchema>;
export type AuthFindIdPayload = z.infer<typeof AuthFindIdPayloadSchema>;
