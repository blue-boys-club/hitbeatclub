import { QUERY_KEYS } from "@/apis/query-keys";
import { useAuthStore } from "@/stores/auth";
import { useShallow } from "zustand/react/shallow";
import { getUserMe } from "../user.api";
import { useQuery } from "@tanstack/react-query";

export const useUserMeQueryOption = () => {
	const userId = useAuthStore(useShallow((state) => state.user?.userId));

	return useQuery({
		queryKey: QUERY_KEYS.user.me,
		queryFn: () => getUserMe(),
		select: (response) => response.data,
		enabled: !!userId,
	});
};
