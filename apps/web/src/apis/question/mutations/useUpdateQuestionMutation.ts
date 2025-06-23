import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateQuestion } from "../question.api";
import { QuestionUpdateRequest } from "@hitbeatclub/shared-types";
import { QUERY_KEYS } from "@/apis/query-keys";

export const useUpdateQuestionMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, payload }: { id: number; payload: QuestionUpdateRequest }) => updateQuestion(id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.question.list });
		},
	});
};
