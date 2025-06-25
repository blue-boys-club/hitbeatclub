import { InquiryUpdateRequest } from "@hitbeatclub/shared-types";
import { updateInquiry } from "../inquiry.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/apis/query-keys";

export const useUpdateInquiryMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, payload }: { id: number; payload: InquiryUpdateRequest }) => updateInquiry(id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inquiry.list });
		},
	});
};
