import { QUERY_KEYS } from "@/apis/query-keys";
import { useMutation } from "@tanstack/react-query";
import { joinWithEmail } from "../auth.api";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { useQueryClient } from "@tanstack/react-query";
import { UserUpdatePayload } from "@hitbeatclub/shared-types/user";
import { signInOnSuccess } from "../auth.utils";

export const useSocialJoinUserMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: MUTATION_KEYS.auth.signup.join.social,
		mutationFn: (data: UserUpdatePayload) => joinWithEmail(data),
		onSuccess: (data) => {
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.me });
			signInOnSuccess(data.data, "email");
		},
	});
};
