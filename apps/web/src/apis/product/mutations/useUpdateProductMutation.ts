import { updateProduct } from "@/apis/product/product.api";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductUpdateRequest } from "@hitbeatclub/shared-types/product";
import { QUERY_KEYS } from "@/apis/query-keys";
import { CommonResponse } from "@/apis/api.type";
import { ArtistResponse } from "@hitbeatclub/shared-types/artist";

export const useUpdateProductMutation = (productId: number) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: MUTATION_KEYS.product.update(productId),
		mutationFn: (product: ProductUpdateRequest) => updateProduct(productId, product),
		onSuccess: () => {
			const artist = queryClient.getQueryData<CommonResponse<ArtistResponse>>(QUERY_KEYS.artist.me);
			if (artist) {
				void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.artist.rawProductList(artist.data.id) });
			}

			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.one(productId) });
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products._list });
		},
	});
};
