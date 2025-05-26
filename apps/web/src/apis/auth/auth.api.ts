import type { AuthResponse } from "./auth.type";
import { BaseResponse } from "../api.type";
import axiosInstance from "../api.client";

export const signInWithGoogle = async ({ code }: { code: string }) => {
	const response = await axiosInstance.post<BaseResponse<AuthResponse>>("/auth/google", null, {
		headers: {
			Authorization: `Bearer ${code}`,
		},
	});
	return response.data;
};
