import { useMutation } from "@tanstack/react-query";
import { joinWithEmail } from "../auth.api";
import { QUERY_KEYS } from "@/apis/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { UserUpdatePayload } from "@hitbeatclub/shared-types/user";
import { signInOnSuccess } from "../auth.utils";

export const useSocialJoinUserMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UserUpdatePayload) => joinWithEmail(data),
		onSuccess: (data) => {
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.me });
			signInOnSuccess(data.data, "email");
		},
	});
};
