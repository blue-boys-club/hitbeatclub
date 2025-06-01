import { QUERY_KEYS } from "@/apis/query-keys";
import { useAuthStore } from "@/stores/auth";
import { getUserMe } from "../user.api";
import { queryOptions } from "@tanstack/react-query";

export const getUserMeQueryOption = () => {
	const userId = useAuthStore.getState().user?.userId;

	return queryOptions({
		queryKey: QUERY_KEYS.user.me,
		queryFn: () => getUserMe(),
		select: (response) => response.data,
		enabled: !!userId,
	});
};
