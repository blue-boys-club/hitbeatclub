import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { AuthGoogleLoginResponse } from "@hitbeatclub/shared-types/auth";

type AllowedLastMethod = "google" | "email";

export interface AuthState {
	user?: AuthGoogleLoginResponse;

	redirect?: string;
	// inviteCode?: string;

	lastLoginMethod?: AllowedLastMethod;
}

export interface AuthActions {
	setUser: (
		updater: ((prevUser: AuthGoogleLoginResponse | undefined) => AuthGoogleLoginResponse) | AuthGoogleLoginResponse,
	) => void;
	// setCurrentWorkspaceId: (currentWorkspaceId: number) => void;

	setLastLoginMethod: (lastLoginMethod: AllowedLastMethod) => void;

	setRedirect: (redirect: string) => void;
	// setInviteCode: (inviteCode: string) => void;

	makeLogout: () => void;
}

const initialState: AuthState = {};

const storeName = "authStore";

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
	devtools(
		persist(
			immer((set) => ({
				...initialState,
				setLastLoginMethod: (lastLoginMethod: AllowedLastMethod) => set({ lastLoginMethod }),
				setUser: (
					userOrUpdater:
						| AuthGoogleLoginResponse
						| ((prevUser: AuthGoogleLoginResponse | undefined) => AuthGoogleLoginResponse),
				) =>
					set((state) => {
						if (typeof userOrUpdater === "function") {
							state.user = userOrUpdater(state.user);
						} else {
							state.user = userOrUpdater;
						}
					}),
				setRedirect: (redirect: string) => set({ redirect }),

				makeLogout: () =>
					set({
						user: undefined,
					}),
			})),
			{ name: storeName, storage: createJSONStorage(() => localStorage) },
		),
		{ name: storeName },
	),
);
