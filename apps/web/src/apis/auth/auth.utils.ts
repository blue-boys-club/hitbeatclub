import { useAuthStore } from "@/store/auth";
import type { AuthResponse } from "./auth.type";

export const signUpOnSuccess = (data: AuthResponse) => {
	console.log("signUpOnSuccess", data);
	const authStore = useAuthStore.getState();
	authStore.setUser(data);

	if (data.workspaceId) {
		authStore.setCurrentWorkspaceId(data.workspaceId);
	}
};
