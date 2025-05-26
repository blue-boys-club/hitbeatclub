import { useMutation } from "@tanstack/react-query";
import { socialJoinUser } from "../user.api";
import { QUERY_KEYS } from "@/apis/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { UserUpdatePayload } from "@hitbeatclub/shared-types/user";
import { useAuthStore } from "@/stores/auth";
import { useShallow } from "zustand/react/shallow";

export const useSocialJoinUserMutation = () => {
	const queryClient = useQueryClient();
	const userId = useAuthStore(useShallow((state) => state.user?.userId));

	return useMutation({
		mutationFn: (data: UserUpdatePayload) => socialJoinUser(userId!, data),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.me });
		},
	});
};
