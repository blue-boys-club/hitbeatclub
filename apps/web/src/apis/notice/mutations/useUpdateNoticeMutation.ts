import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { updateNotice } from "../notice.api";
import { NoticeUpdatePayload } from "../notice.type";
import { QUERY_KEYS } from "@/apis/query-keys";
import { MUTATION_KEYS } from "@/apis/mutation-keys";

export const useUpdateNoticeMutation = (
	id: string,
	options?: Omit<UseMutationOptions<any, any, NoticeUpdatePayload>, "mutationKey" | "mutationFn">,
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: MUTATION_KEYS.notice.update,
		mutationFn: (payload: NoticeUpdatePayload) => updateNotice(id, payload),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notice.detail(id) });
		},
		...options,
	});
};
