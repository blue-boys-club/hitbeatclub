import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "../user.api";
import { UserProfileUpdatePayload } from "@hitbeatclub/shared-types/user";
import { QUERY_KEYS } from "@/apis/query-keys";
import { useAuthStore } from "@/stores/auth";
import { useShallow } from "zustand/react/shallow";

export const useUpdateUserProfileMutation = () => {
	const queryClient = useQueryClient();
	const userId = useAuthStore(useShallow((state) => state.user?.userId));

	return useMutation({
		mutationFn: (data: UserProfileUpdatePayload) => {
			if (!userId) throw new Error("User ID not found");
			return updateUserProfile(userId, data);
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.me });
		},
	});
};
