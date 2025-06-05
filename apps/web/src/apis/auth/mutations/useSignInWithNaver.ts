import { MutationOptions, useMutation } from "@tanstack/react-query";
import { signInWithNaver } from "../auth.api";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { signInOnSuccess } from "../auth.utils";
import { CommonResponse } from "@/apis/api.type";
import { AuthLoginResponse } from "@hitbeatclub/shared-types/auth";

export const useSignInWithNaver = (
	options?: Omit<
		MutationOptions<CommonResponse<AuthLoginResponse>, Error, { code: string }>,
		"mutationKey" | "mutationFn"
	>,
) => {
	return useMutation({
		mutationKey: MUTATION_KEYS.auth.login.naver,
		mutationFn: signInWithNaver,
		onSuccess: (data) => {
			signInOnSuccess(data.data, "naver");
		},
		...options,
	});
};
