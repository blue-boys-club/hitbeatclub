import { useMutation } from "@tanstack/react-query";
import { deleteNotice } from "../notice.api";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/apis/query-keys";

export const useDeleteNoticeMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => deleteNotice(id),
		mutationKey: MUTATION_KEYS.notice.delete,
		onSuccess: (_, id) => {
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notice.detail(id) });
			void queryClient.invalidateQueries({ queryKey: ["notice", "list"] });
		},
	});
};
