import { useMutation } from "@tanstack/react-query";
import { likeProduct } from "../product.api";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/apis/query-keys";
import { ProductListPagingResponse } from "@hitbeatclub/shared-types";
import { MUTATION_KEYS } from "@/apis/mutation-keys";

export const useLikeProductMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: [MUTATION_KEYS.product.like],
		mutationFn: likeProduct,
		onSuccess: (_, variable) => {
			const id = variable;
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.one(id), exact: true });

			// loop through list and if id is there, invalidate it
			const lists = queryClient.getQueriesData<ProductListPagingResponse>({
				queryKey: QUERY_KEYS.products._list,
			});
			lists.forEach(([_, data]) => {
				if (data?.data.some((product) => product.id === id)) {
					void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.products._list, data._pagination] });
				}
			});

			// infinite list -> just invalidate the infinite list
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products._infiniteList });

			// invalidate search
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.search._list });

			void queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.user._likedProducts,
			});

			// invalidate artist product lists
			void queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.artist._key,
			});
		},
	});
};
