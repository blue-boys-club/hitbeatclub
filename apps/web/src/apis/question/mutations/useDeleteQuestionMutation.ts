import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteQuestion } from "../question.api";
import { QUERY_KEYS } from "@/apis/query-keys";

export const useDeleteQuestionMutation = (id: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => deleteQuestion(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.question.list });
		},
	});
};
