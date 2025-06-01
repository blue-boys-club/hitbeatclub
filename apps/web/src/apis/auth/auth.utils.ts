import { AllowedLastMethod, useAuthStore } from "@/stores/auth";
import type { AuthLoginResponse } from "@hitbeatclub/shared-types/auth";
import router, { useRouter } from "next/router";
// import { useRouter } from "next/navigation";

export const signInOnSuccess = (data: AuthLoginResponse, method: AllowedLastMethod, redirect: boolean = true) => {
	console.log("signInOnSuccess", data);

	const authStore = useAuthStore.getState();
	authStore.setUser(data);
	authStore.setLastLoginMethod(method);

	const navigate = (path: string) => {
		window.history.pushState({}, "", path);
	};

	if (redirect) {
		if (data.phoneNumber === null) {
			navigate("/auth/signup");
		} else {
			navigate("/");
		}
	}
};
