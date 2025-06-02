import { useMutation } from "@tanstack/react-query";
import { updateArtist } from "../artist.api";
import { ArtistUpdatePayload } from "../artist.type";
import { MUTATION_KEYS } from "@/apis/mutation-keys";

export const useUpdateArtistMutation = (id: number) => {
	return useMutation({
		mutationKey: MUTATION_KEYS.artist.update(id),
		mutationFn: (payload: ArtistUpdatePayload) => updateArtist(id, payload),
	});
};
