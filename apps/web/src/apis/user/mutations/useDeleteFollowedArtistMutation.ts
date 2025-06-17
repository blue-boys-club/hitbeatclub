import { useMutation } from "@tanstack/react-query";
import { deleteFollowedArtist } from "../user.api";

export const useDeleteFollowedArtistMutation = (userId: number) => {
	return useMutation({
		mutationFn: (artistId: number) => deleteFollowedArtist(userId, artistId),
	});
};
