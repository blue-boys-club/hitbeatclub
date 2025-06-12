import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateArtist } from "../artist.api";
import { ArtistResponse, ArtistUpdateRequest } from "@hitbeatclub/shared-types/artist";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { QUERY_KEYS } from "@/apis/query-keys";
import { CommonResponse } from "@/apis/api.type";

export const useUpdateArtistMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: MUTATION_KEYS.artist.update,
		mutationFn: ({ id, payload }: { id: number; payload: ArtistUpdateRequest }) => updateArtist(id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.artist.me });
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products._list });
		},
	});
};
