import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { AuthLoginResponse } from "@hitbeatclub/shared-types/auth";

export type AllowedLastMethod = "google" | "email" | "naver" | "kakao";

export interface AuthState {
	user?: AuthLoginResponse;

	redirect?: string;
	// inviteCode?: string;

	lastLoginMethod?: AllowedLastMethod;
}

export interface AuthActions {
	setUser: (updater: ((prevUser: AuthLoginResponse | undefined) => AuthLoginResponse) | AuthLoginResponse) => void;
	setPhoneNumber: (phoneNumber: string) => void;
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
					userOrUpdater: AuthLoginResponse | ((prevUser: AuthLoginResponse | undefined) => AuthLoginResponse),
				) =>
					set((state) => {
						if (typeof userOrUpdater === "function") {
							state.user = userOrUpdater(state.user);
						} else {
							state.user = userOrUpdater;
						}
					}),
				setPhoneNumber: (phoneNumber: string) =>
					set((state) => {
						if (state.user) {
							state.user.phoneNumber = phoneNumber;
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
