import { AllowedLastMethod, useAuthStore } from "@/stores/auth";
import type { AuthLoginResponse } from "@hitbeatclub/shared-types/auth";
// import { useRouter } from "next/navigation";

export const signInOnSuccess = (data: AuthLoginResponse, method: AllowedLastMethod) => {
	console.log("signInOnSuccess", data);

	const authStore = useAuthStore.getState();
	authStore.setUser(data);
	authStore.setLastLoginMethod(method);

	if (data.phoneNumber === null) {
		// router.push("/auth/join");
		window.location.href = "/auth/signup";
	} else {
		// router.push("/");
		window.location.href = "/";
	}
};
