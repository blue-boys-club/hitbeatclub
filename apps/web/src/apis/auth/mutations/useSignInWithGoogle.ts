import { MutationOptions, useMutation } from "@tanstack/react-query";
import { signInWithGoogle } from "../auth.api";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { signInOnSuccess } from "../auth.utils";
import { CommonResponse } from "@/apis/api.type";
import { AuthLoginResponse } from "@hitbeatclub/shared-types/auth";

export const useSignInWithGoogle = (
	options?: Omit<
		MutationOptions<CommonResponse<AuthLoginResponse>, Error, { code: string }>,
		"mutationKey" | "mutationFn"
	>,
) => {
	return useMutation({
		mutationKey: MUTATION_KEYS.auth.login.google,
		mutationFn: signInWithGoogle,
		onSuccess: (data) => {
			signInOnSuccess(data.data, "google");
		},
		...options,
	});
};
