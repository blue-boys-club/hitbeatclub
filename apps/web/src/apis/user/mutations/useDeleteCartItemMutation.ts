import { useMutation } from "@tanstack/react-query";
import { deleteCartItem } from "../user.api";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/apis/query-keys";

export const useDeleteCartItemMutation = (userId: number) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (cartItemId: number) => deleteCartItem(userId, cartItemId),
		mutationKey: MUTATION_KEYS.cart.delete,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart.list });
		},
	});
};
