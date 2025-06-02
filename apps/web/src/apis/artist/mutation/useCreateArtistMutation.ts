import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createArtist } from "../artist.api";
import { ArtistCreateRequest } from "@hitbeatclub/shared-types/artist";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { QUERY_KEYS } from "@/apis/query-keys";

export const useCreateArtistMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: MUTATION_KEYS.artist.create,
		mutationFn: (payload: ArtistCreateRequest) => createArtist(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.artist.me });
		},
	});
};
