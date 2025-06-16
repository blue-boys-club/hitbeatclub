import { useMutation } from "@tanstack/react-query";
import { updateCartItem } from "../cart.api";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { QUERY_KEYS } from "@/apis/query-keys";
import { useQueryClient } from "@tanstack/react-query";

export const useUpdateCartItemMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateCartItem,
		mutationKey: MUTATION_KEYS.cart.update,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart.list });
		},
	});
};
