import { create } from "zustand";
// import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";

export enum SidebarType {
	TRACK = "track",
	PLAYLIST = "playlist",
}

export interface LayoutState {
	leftSidebar: {
		isOpen: boolean;
	};
	rightSidebar: {
		isOpen: boolean;
		currentType: SidebarType;
		trackId?: number | null;
	};
}

export interface LayoutActions {
	setLeftSidebar: (isOpen: LayoutState["leftSidebar"]["isOpen"]) => void;
	setRightSidebar: (
		isOpen: LayoutState["rightSidebar"]["isOpen"],
		states?: Partial<Omit<LayoutState["rightSidebar"], "isOpen">>,
	) => void;

	init: () => void;
}

export type LayoutStore = LayoutState & LayoutActions;

const initialState: LayoutState = {
	leftSidebar: {
		isOpen: true,
	},
	rightSidebar: {
		isOpen: true,
		currentType: SidebarType.PLAYLIST,
	},
};

const name = "LayoutStore";

export const useLayoutStore = create<LayoutStore>()(
	devtools(
		immer<LayoutStore>((set) => ({
			...initialState,

			setLeftSidebar: (isOpen) =>
				set((state) => {
					state.leftSidebar.isOpen = isOpen;
				}),

			setRightSidebar: (isOpen, states) =>
				set((state) => {
					state.rightSidebar.isOpen = isOpen;
					if (states) {
						state.rightSidebar = {
							...state.rightSidebar,
							...states,
						};
					}
				}),

			init: () => set(initialState),
		})),
		{ name },
	),
);
