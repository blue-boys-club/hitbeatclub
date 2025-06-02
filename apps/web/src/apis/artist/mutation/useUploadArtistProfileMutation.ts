import { useMutation } from "@tanstack/react-query";
import { uploadArtistProfile } from "../artist.api";
import { MUTATION_KEYS } from "@/apis/mutation-keys";

export const useUploadArtistProfileMutation = () => {
	return useMutation({
		mutationKey: MUTATION_KEYS.artist.uploadProfile,
		mutationFn: uploadArtistProfile,
	});
};
