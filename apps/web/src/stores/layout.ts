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
		trackId?: string | number | null; // TODO: backend 협의 후 수정
	};
	isMembership: boolean;
}

export interface LayoutActions {
	setLeftSidebar: (isOpen: LayoutState["leftSidebar"]["isOpen"]) => void;
	setRightSidebar: (
		isOpen: LayoutState["rightSidebar"]["isOpen"],
		states?: Partial<Omit<LayoutState["rightSidebar"], "isOpen">>,
	) => void;
	setMembership: (isMembership: LayoutState["isMembership"]) => void;
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

	// TODO: User information based （servers based). not here.
	isMembership: false,
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

			setMembership: (isMembership) =>
				set((state) => {
					state.isMembership = isMembership;
				}),

			init: () => set(initialState),
		})),
		{ name },
	),
);
