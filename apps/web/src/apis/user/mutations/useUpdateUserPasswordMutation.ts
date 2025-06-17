import { useMutation } from "@tanstack/react-query";
import { updateUserPassword } from "../user.api";
import { UserPasswordResetPayload } from "@hitbeatclub/shared-types/user";
import { useAuthStore } from "@/stores/auth";
import { useShallow } from "zustand/react/shallow";

export const useUpdateUserPasswordMutation = () => {
	const userId = useAuthStore(useShallow((state) => state.user?.userId));

	return useMutation({
		mutationFn: (data: UserPasswordResetPayload) => {
			if (!userId) throw new Error("User ID not found");
			return updateUserPassword(userId, data);
		},
		onSuccess: () => {},
	});
};
