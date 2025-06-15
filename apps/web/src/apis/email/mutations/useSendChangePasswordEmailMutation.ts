import { useMutation } from "@tanstack/react-query";
import { sendEmail } from "../email.api";
import { MUTATION_KEYS } from "@/apis/mutation-keys";

export const useSendChangePasswordEmailMutation = () => {
	return useMutation({
		mutationFn(email: string) {
			return sendEmail({
				type: "CHANGE_PASSWORD",
				to: email,
			});
		},
		mutationKey: MUTATION_KEYS.email.sendChangePassword,
	});
};
