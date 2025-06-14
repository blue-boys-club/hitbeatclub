import { useMutation } from "@tanstack/react-query";
import { unlikeProduct } from "../product.api";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/apis/query-keys";
import { ProductListPagingResponse } from "@hitbeatclub/shared-types";

export const useUnlikeProductMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: unlikeProduct,
		onSuccess: (_, variable) => {
			const id = variable;
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.one(id) });

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

			void queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.user._infiniteLikedProducts,
			});
			void queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.user._likedProducts,
			});
		},
	});
};
