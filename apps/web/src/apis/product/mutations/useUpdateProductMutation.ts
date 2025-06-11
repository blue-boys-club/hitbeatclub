import { updateProduct } from "@/apis/product/product.api";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductUpdateRequest } from "@hitbeatclub/shared-types/product";
import { QUERY_KEYS } from "@/apis/query-keys";

export const useUpdateProductMutation = (productId: number) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: MUTATION_KEYS.product.update(productId),
		mutationFn: (product: ProductUpdateRequest) => updateProduct(productId, product),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.one(productId) });
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products._list });
		},
	});
};
