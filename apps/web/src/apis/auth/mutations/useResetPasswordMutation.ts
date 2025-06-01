import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../auth.api";
import { MUTATION_KEYS } from "@/apis/mutation-keys";

export const useResetPasswordMutation = () => {
	return useMutation({
		mutationKey: MUTATION_KEYS.auth.resetPassword,
		mutationFn: resetPassword,
	});
};
