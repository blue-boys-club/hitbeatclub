import { useMutation } from "@tanstack/react-query";
import { increaseProductViewCount, likeProduct } from "../product.api";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/apis/query-keys";
import { ProductListPagingResponse } from "@hitbeatclub/shared-types";
import { MUTATION_KEYS } from "@/apis/mutation-keys";

export const useIncreaseProductViewCountMutation = () => {
	// const queryClient = useQueryClient();

	return useMutation({
		mutationKey: [MUTATION_KEYS.product.increaseViewCount],
		mutationFn: increaseProductViewCount,
		// onSuccess: (_, variable) => {
		// 	void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.one(variable) });
		// },
	});
};
