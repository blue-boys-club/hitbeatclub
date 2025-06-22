import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startPlayer } from "../player.api";
import { MutationOptions } from "@tanstack/react-query";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { QUERY_KEYS } from "@/apis/query-keys";
import { CommonResponseId } from "@/apis/api.type";
import { PlayerStartRequest } from "@hitbeatclub/shared-types";

export const useStartPlayerMutation = (options?: MutationOptions<CommonResponseId, Error, PlayerStartRequest>) => {
	const queryClient = useQueryClient();
	const { onSuccess, ...restOptions } = options ?? {};

	return useMutation({
		mutationFn: startPlayer,
		mutationKey: MUTATION_KEYS.player.startPlayer,
		...restOptions,
		onSuccess: (data, variables, context) => {
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart.list });
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.payment._key });
			onSuccess?.(data, variables, context);
		},
	});
};
