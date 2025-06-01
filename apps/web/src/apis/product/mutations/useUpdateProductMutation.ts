import { updateProduct } from "@/apis/product/product.api";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { useMutation } from "@tanstack/react-query";
import { ProductUpdateRequest } from "@hitbeatclub/shared-types/product";

export const useUpdateProductMutation = (productId: number) => {
	return useMutation({
		mutationKey: MUTATION_KEYS.product.update(productId),
		mutationFn: (product: ProductUpdateRequest) => updateProduct(productId, product),
	});
};
