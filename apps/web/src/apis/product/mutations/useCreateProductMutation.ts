import { createProduct } from "@/apis/product/product.api";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { useMutation } from "@tanstack/react-query";

export const useCreateProductMutation = () => {
	return useMutation({
		mutationKey: MUTATION_KEYS.product.create,
		mutationFn: createProduct,
	});
};
