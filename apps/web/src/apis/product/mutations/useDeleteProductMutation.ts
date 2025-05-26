import { deleteProduct, updateProduct } from "@/apis/product/product.api";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { useMutation } from "@tanstack/react-query";

export const useDeleteProductMutation = (productId: number) => {
	return useMutation({
		mutationKey: MUTATION_KEYS.product.update(productId),
		mutationFn: () => deleteProduct(productId),
	});
};
