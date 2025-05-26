import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { AuthResponse } from "@/apis/auth/auth.type";

type AllowedLastMethod = "google" | "email";

export interface AuthState {
	user?: AuthResponse;
	// currentWorkspaceId?: number;

	redirect?: string;
	// inviteCode?: string;

	lastLoginMethod?: AllowedLastMethod;
}

export interface AuthActions {
	setUser: (updater: ((prevUser: AuthResponse | undefined) => AuthResponse) | AuthResponse) => void;
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
				setUser: (userOrUpdater: AuthResponse | ((prevUser: AuthResponse | undefined) => AuthResponse)) =>
					set((state) => {
						if (typeof userOrUpdater === "function") {
							state.user = userOrUpdater(state.user);
						} else {
							state.user = userOrUpdater;
						}
					}),
				// setCurrentWorkspaceId: (currentWorkspaceId: number) => set({ currentWorkspaceId }),
				setRedirect: (redirect: string) => set({ redirect }),
				// setInviteCode: (inviteCode: string) => set({ inviteCode }),
				makeLogout: () =>
					set({
						user: undefined,
						// currentWorkspaceId: undefined,
					}),
			})),
			{ name: storeName, storage: createJSONStorage(() => localStorage) },
		),
		{ name: storeName },
	),
);
