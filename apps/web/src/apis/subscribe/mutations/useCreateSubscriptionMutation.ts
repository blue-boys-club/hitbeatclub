import { useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/apis/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { SubscribeRequest } from "@hitbeatclub/shared-types";
import { subscribeMembership } from "../subscribe.api";

export const useCreateSubscriptionMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: SubscribeRequest) => subscribeMembership(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.me });
		},
	});
};
