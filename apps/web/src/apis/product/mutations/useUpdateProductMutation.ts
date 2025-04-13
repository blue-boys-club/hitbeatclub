import { updateProduct } from "../product.api";
import { MUTATION_KEYS } from "@/apis/query-keys";
import { useMutation } from "@tanstack/react-query";

export const useUpdateProductMutation = (productId: number) => {
	return useMutation({
		mutationKey: MUTATION_KEYS.product.update(productId),
		mutationFn: (product: unknown) => updateProduct(productId, product),
	});
};
