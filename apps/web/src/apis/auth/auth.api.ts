import axiosInstance from "@/apis/api.client";
import type { BaseResponse } from "@/apis/api.type";
import type { AuthResponse } from "./auth.type";

export const signInWithGoogle = async ({ code }: { code: string }) => {
	const response = await axiosInstance.post<BaseResponse<AuthResponse>>("/auth/google", null, {
		headers: {
			Authorization: `Bearer ${code}`,
		},
	});
	return response.data;
};
