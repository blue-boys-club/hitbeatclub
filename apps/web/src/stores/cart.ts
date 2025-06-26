import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface CartItem {
	productId: number;
	licenseId: number;
}

export interface CartState {
	items: CartItem[];
}

export interface CartActions {
	addItem: (productId: number, licenseId: number) => void;
	removeItem: (productId: number) => void;
	clear: () => void;
	init: () => void;
}

export type CartStore = CartState & CartActions;

const initialState: CartState = {
	items: [],
};

const name = "CartStore";

export const useCartStore = create<CartStore>()(
	devtools(
		persist(
			immer<CartStore>((set) => ({
				...initialState,

				addItem: (productId, licenseId) =>
					set((state) => {
						// find if item already exists, if so update the licenseId
						const existingItem = state.items.find((item) => item.productId === productId);
						if (existingItem) {
							existingItem.licenseId = licenseId;
						} else {
							state.items.push({ productId, licenseId });
						}
					}),

				removeItem: (productId) =>
					set((state) => {
						state.items = state.items.filter((item) => item.productId !== productId);
					}),
				clear: () => set({ items: [] }),

				init: () => set(() => ({ ...initialState })),
			})),
			{ storage: createJSONStorage(() => localStorage), name },
		),
		{ name },
	),
);
