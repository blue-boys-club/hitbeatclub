import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createQuestion } from "../question.api";
import { QuestionCreateRequest } from "@hitbeatclub/shared-types";
import { QUERY_KEYS } from "@/apis/query-keys";

export const useCreateQuestionMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: QuestionCreateRequest) => createQuestion(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.question.list });
		},
	});
};
