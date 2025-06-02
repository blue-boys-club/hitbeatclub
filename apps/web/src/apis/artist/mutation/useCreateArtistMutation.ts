import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createArtist } from "../artist.api";
import { ArtistCreatePayload } from "../artist.type";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { QUERY_KEYS } from "@/apis/query-keys";

export const useCreateArtistMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: MUTATION_KEYS.artist.create,
		mutationFn: (payload: ArtistCreatePayload) => createArtist(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.artist.me });
		},
	});
};
