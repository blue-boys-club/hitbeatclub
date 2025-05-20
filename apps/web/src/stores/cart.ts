import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface CartItem {
	id: number;
	licenseId: number;
}

export interface CartState {
	items: CartItem[];
}

export interface CartActions {
	addItem: (item: CartItem) => void;
	removeItem: (id: number) => void;
	clearCart: () => void;
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

				addItem: (item) =>
					set((state) => {
						const existingItemIndex = state.items.findIndex((i) => i.id === item.id);
						if (existingItemIndex !== -1) {
							// If item already exists, update its licenseId
							state.items[existingItemIndex]!.licenseId = item.licenseId;
						} else {
							// Otherwise, add the new item
							state.items.push(item);
						}
					}),

				removeItem: (id) =>
					set((state) => {
						state.items = state.items.filter((item) => item.id !== id);
					}),

				clearCart: () =>
					set((state) => {
						state.items = [];
					}),

				init: () => set(initialState),
			})),
			{ name, storage: createJSONStorage(() => localStorage) },
		),
		{ name },
	),
);
