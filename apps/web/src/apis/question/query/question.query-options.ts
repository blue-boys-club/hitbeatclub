import { queryOptions } from "@tanstack/react-query";
import { getQuestions } from "../question.api";
import { QUERY_KEYS } from "@/apis/query-keys";

export const getQuestionListQueryOption = () => {
	return queryOptions({
		queryKey: QUERY_KEYS.question.list,
		queryFn: getQuestions,
	});
};
