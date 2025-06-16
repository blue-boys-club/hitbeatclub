import { useMutation } from "@tanstack/react-query";
import { updateCartItem } from "../user.api";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { QUERY_KEYS } from "@/apis/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { UpdateCartItemPayload } from "../user.type";

export const useUpdateCartItemMutation = (userId: number) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: UpdateCartItemPayload) => updateCartItem(userId, payload),
		mutationKey: MUTATION_KEYS.cart.update,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart.list });
		},
	});
};
