import { useMutation } from "@tanstack/react-query";
import { signInWithGoogle } from "../auth.api";
import { useAuthStore } from "@/store/auth";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { signUpOnSuccess } from "../auth.utils";

export const useSignInWithGoogle = () => {
	return useMutation({
		mutationKey: MUTATION_KEYS.auth.login.google,
		mutationFn: signInWithGoogle,
		onSuccess: (data) => {
			signUpOnSuccess(data.data);
		},
	});
};
