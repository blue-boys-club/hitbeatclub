import { createProduct } from "@/apis/product/product.api";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/apis/query-keys";
import type { CommonResponse } from "@/apis/api.type";
import { ArtistResponse } from "@hitbeatclub/shared-types/artist";

export const useCreateProductMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: MUTATION_KEYS.product.create,
		mutationFn: createProduct,
		onSuccess: () => {
			const artistId = queryClient.getQueryData<CommonResponse<ArtistResponse>>(QUERY_KEYS.artist.me);
			if (artistId) {
				void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.artist.rawProductList(artistId.data.id) });
			}

			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products._list });
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.searchInfo });
		},
	});
};
