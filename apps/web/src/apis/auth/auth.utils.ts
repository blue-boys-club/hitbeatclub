import { useAuthStore } from "@/stores/auth";
import type { AuthResponse } from "./auth.type";

export const signUpOnSuccess = (data: AuthResponse) => {
	console.log("signUpOnSuccess", data);
	const authStore = useAuthStore.getState();
	authStore.setUser(data);
};
