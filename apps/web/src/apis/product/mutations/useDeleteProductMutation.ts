import { deleteProduct } from "@/apis/product/product.api";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/apis/query-keys";

export const useDeleteProductMutation = (productId: number) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: MUTATION_KEYS.product.update(productId),
		mutationFn: () => deleteProduct(productId),

		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.one(productId) });
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products._list });
		},
	});
};
