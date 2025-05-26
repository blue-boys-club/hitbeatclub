import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";

export interface TemporaryState {
	googleAuth?: {
		code: string;
	};
}

export interface TemporaryActions {
	setGoogleAuth: (code: string) => void;
	resetGoogleAuth: () => void;
	init: () => void;
}

export type TemporaryStore = TemporaryState & TemporaryActions;

const initialState: TemporaryState = {
	googleAuth: undefined,
};

const name = "TemporaryStore";

export const useTemporaryStore = create<TemporaryStore>()(
	devtools(
		immer<TemporaryStore>((set) => ({
			...initialState,

			setGoogleAuth: (code) =>
				set((state) => {
					state.googleAuth = { code };
				}),

			resetGoogleAuth: () =>
				set((state) => {
					state.googleAuth = undefined;
				}),

			init: () => set(initialState),
		})),
		{ name },
	),
);
