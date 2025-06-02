import { useMutation } from "@tanstack/react-query";
import { createArtist } from "../artist.api";
import { ArtistCreatePayload } from "../artist.type";
import { MUTATION_KEYS } from "@/apis/mutation-keys";

export const useCreateArtistMutation = () => {
	return useMutation({
		mutationKey: MUTATION_KEYS.artist.create,
		mutationFn: (payload: ArtistCreatePayload) => createArtist(payload),
	});
};
