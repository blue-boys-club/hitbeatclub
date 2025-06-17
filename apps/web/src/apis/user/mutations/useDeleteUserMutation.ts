import { useMutation } from "@tanstack/react-query";
import { leaveMe } from "../user.api";
import { useAuthStore } from "@/stores/auth";
import { useShallow } from "zustand/react/shallow";
import { UserDeletePayload } from "@hitbeatclub/shared-types";

export const useDeleteUserMutation = () => {
	const userId = useAuthStore(useShallow((state) => state.user?.userId));

	return useMutation({
		mutationFn: (data: UserDeletePayload) => {
			if (!userId) throw new Error("User ID not found");
			return leaveMe(userId, data.deletedReason);
		},
	});
};
