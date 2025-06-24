import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { updateNotice } from "../notice.api";
import { QUERY_KEYS } from "@/apis/query-keys";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { NoticeCreateResponse, NoticeUpdateRequest } from "@hitbeatclub/shared-types";
import { CommonResponse } from "@/apis/api.type";

export const useUpdateNoticeMutation = (
	id: string,
	options?: Omit<
		UseMutationOptions<CommonResponse<NoticeCreateResponse>, any, NoticeUpdateRequest>,
		"mutationKey" | "mutationFn"
	>,
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
