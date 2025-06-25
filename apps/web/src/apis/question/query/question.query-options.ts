import { queryOptions } from "@tanstack/react-query";
import { getQuestionDetail, getQuestions } from "../question.api";
import { QUERY_KEYS } from "@/apis/query-keys";

export const getQuestionListQueryOption = () => {
	return queryOptions({
		queryKey: QUERY_KEYS.question.list,
		queryFn: getQuestions,
		select: (response) => response.data,
	});
};

export const getQuestionDetailQueryOption = (id: number) => {
	return queryOptions({
		queryKey: QUERY_KEYS.question.detail(id),
		queryFn: () => getQuestionDetail(id),
		select: (response) => response.data,
	});
};
