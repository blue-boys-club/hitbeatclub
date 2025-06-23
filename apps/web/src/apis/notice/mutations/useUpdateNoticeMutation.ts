import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { updateNotice } from "../notice.api";
import { QUERY_KEYS } from "@/apis/query-keys";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { NoticeUpdateRequest } from "@hitbeatclub/shared-types";

export const useUpdateNoticeMutation = (
	id: string,
	options?: Omit<UseMutationOptions<any, any, NoticeUpdateRequest>, "mutationKey" | "mutationFn">,
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: MUTATION_KEYS.notice.update,
		mutationFn: (payload: NoticeUpdateRequest) => updateNotice(id, payload),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notice.detail(id) });
		},
		...options,
	});
};
