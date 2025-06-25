import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteInquiry } from "../inquiry.api";
import { QUERY_KEYS } from "@/apis/query-keys";

export const useDeleteInquiryMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => deleteInquiry(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inquiry.list });
		},
	});
};
