import { createProduct } from "../product.api";
import { MUTATION_KEYS } from "@/apis/query-keys";
import { useMutation } from "@tanstack/react-query";

export const useCreateProductMutation = () => {
	return useMutation({
		mutationKey: MUTATION_KEYS.product.create,
		mutationFn: createProduct,
	});
};
