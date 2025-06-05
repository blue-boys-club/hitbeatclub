import { createProduct } from "@/apis/product/product.api";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/apis/query-keys";

export const useCreateProductMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: MUTATION_KEYS.product.create,
		mutationFn: createProduct,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.list });
		},
	});
};
