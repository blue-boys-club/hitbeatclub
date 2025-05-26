import { useMutation } from "@tanstack/react-query";
import { findEmail } from "../auth.api";
import { MUTATION_KEYS } from "@/apis/mutation-keys";

export const useFindEmailMutation = () => {
	return useMutation({
		mutationKey: MUTATION_KEYS.auth.findEmail,
		mutationFn: findEmail,
	});
};
