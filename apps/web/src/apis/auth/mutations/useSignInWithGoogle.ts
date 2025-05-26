import { useMutation } from "@tanstack/react-query";
import { MUTATION_KEYS } from "@/apis/query-keys";
import { signUpOnSuccess } from "../auth.utils";
import { signInWithGoogle } from "../auth.api";

export const useSignInWithGoogle = () => {
	return useMutation({
		mutationKey: MUTATION_KEYS.auth.login.google,
		mutationFn: signInWithGoogle,
		onSuccess: (data) => {
			signUpOnSuccess(data.data);
		},
	});
};
