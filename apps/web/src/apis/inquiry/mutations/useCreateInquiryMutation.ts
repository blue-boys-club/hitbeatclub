import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInquiry } from "../inquiry.api";
import { QUERY_KEYS } from "@/apis/query-keys";
import { InquiryCreateRequest } from "@hitbeatclub/shared-types";

export const useCreateInquiryMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: InquiryCreateRequest) => createInquiry(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inquiry.list });
		},
	});
};
