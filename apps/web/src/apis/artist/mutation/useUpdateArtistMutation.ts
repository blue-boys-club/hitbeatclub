import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateArtist } from "../artist.api";
import { ArtistUpdatePayload } from "../artist.type";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { QUERY_KEYS } from "@/apis/query-keys";

export const useUpdateArtistMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: MUTATION_KEYS.artist.update,
		mutationFn: ({ id, payload }: { id: number; payload: ArtistUpdatePayload }) => updateArtist(id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.artist.me });
		},
	});
};
