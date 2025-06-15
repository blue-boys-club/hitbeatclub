import { MutationOptions, useMutation } from "@tanstack/react-query";
import { signInWithEmail } from "../auth.api";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { signInOnSuccess } from "../auth.utils";
import { CommonResponse } from "@/apis/api.type";
import { AuthLoginResponse, AuthLoginPayloadSchema } from "@hitbeatclub/shared-types/auth";
import { z } from "zod";

export const useSignInWithEmail = (
	options?: Omit<
		MutationOptions<CommonResponse<AuthLoginResponse>, Error, z.input<typeof AuthLoginPayloadSchema>>,
		"mutationKey" | "mutationFn"
	>,
) => {
	const { onSuccess, ...rest } = options || {};
	return useMutation({
		mutationKey: MUTATION_KEYS.auth.login.email,
		mutationFn: signInWithEmail,
		onSuccess: (data, variables, context) => {
			console.log("data", data);
			signInOnSuccess(data.data, "email");
			onSuccess?.(data, variables, context);
		},
		...rest,
	});
};
