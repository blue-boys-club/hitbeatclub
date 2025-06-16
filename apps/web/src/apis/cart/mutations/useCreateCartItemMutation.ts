import { useMutation } from "@tanstack/react-query";
import { createCartItem } from "../cart.api";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { QUERY_KEYS } from "@/apis/query-keys";
import { useQueryClient } from "@tanstack/react-query";

export const useCreateCartItemMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createCartItem,
		mutationKey: MUTATION_KEYS.cart.create,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart.list });
		},
	});
};
