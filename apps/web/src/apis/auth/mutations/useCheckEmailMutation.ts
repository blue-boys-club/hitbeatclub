import { useMutation } from "@tanstack/react-query";
import { checkEmail } from "../auth.api";
import { MUTATION_KEYS } from "@/apis/mutation-keys";

export const useCheckEmailMutation = () => {
	return useMutation({
		mutationKey: MUTATION_KEYS.auth.signup.checkEmail,
		mutationFn: checkEmail,
	});
};
