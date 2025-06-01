import axiosInstance from "@/apis/api.client";
import type { CommonResponse, CommonResponseId } from "@/apis/api.type";
import { z } from "zod";
import {
	AuthCheckEmailResponse,
	AuthLoginPayloadSchema,
	AuthLoginResponse,
	AuthFindIdPayloadSchema,
	AuthCheckEmailRequestSchema,
	AuthFindIdResponse,
	AuthResetPasswordPayloadSchema,
} from "@hitbeatclub/shared-types/auth";
import { UserUpdatePayloadSchema } from "@hitbeatclub/shared-types/user";

/**
 * 구글 로그인
 * @param code 구글 로그인 코드
 * @returns 로그인 응답
 */
export const signInWithGoogle = async ({ code }: { code: string }) => {
	const response = await axiosInstance.post<CommonResponse<AuthLoginResponse>>("/auth/google", null, {
		headers: {
			Authorization: `Bearer ${code}`,
		},
	});
	return response.data;
};

/**
 * 이메일로 로그인
 * @param payload 로그인 요청 페이로드
 * @returns 로그인 응답
 */
export const signInWithEmail = async (payload: z.input<typeof AuthLoginPayloadSchema>) => {
	const parsed = AuthLoginPayloadSchema.parse(payload);
	const response = await axiosInstance.post<CommonResponse<AuthLoginResponse>>("/auth/login", parsed);
	return response.data;
};

/**
 * 이메일 중복 확인
 * @param payload 이메일 중복 확인 요청 페이로드
 * @returns 이메일 중복 확인 응답
 */
export const checkEmail = async (payload: z.input<typeof AuthCheckEmailRequestSchema>) => {
	const parsed = AuthCheckEmailRequestSchema.parse(payload);
	const response = await axiosInstance.get<CommonResponse<AuthCheckEmailResponse>>(`/auth/check-email`, {
		params: parsed,
	});
	return response.data;
};

/**
 * 이메일로 아이디 찾기
 * @param payload 아이디 찾기 요청 페이로드
 * @returns 아이디 찾기 응답
 */
export const findEmail = async (payload: z.input<typeof AuthFindIdPayloadSchema>) => {
	const parsed = AuthFindIdPayloadSchema.parse(payload);
	const response = await axiosInstance.get<CommonResponse<AuthFindIdResponse>>(`/auth/find-email`, {
		params: parsed,
	});
	return response.data;
};

/**
 * 이메일로 회원가입
 * @param payload 회원가입 요청 페이로드
 * @returns 회원가입 응답
 */
export const joinWithEmail = async (payload: z.input<typeof UserUpdatePayloadSchema>) => {
	const parsed = UserUpdatePayloadSchema.parse(payload);
	const response = await axiosInstance.post<CommonResponse<AuthLoginResponse>>("/auth/join", parsed);
	return response.data;
};

/**
 * 비밀번호 재설정
 * @param payload 비밀번호 재설정 요청 페이로드
 * @returns 비밀번호 재설정 응답
 */
export const resetPassword = async (payload: z.input<typeof AuthResetPasswordPayloadSchema>) => {
	const parsed = AuthResetPasswordPayloadSchema.parse(payload);
	const response = await axiosInstance.post<CommonResponseId>(`/auth/reset-password`, parsed);
	return response.data;
};
