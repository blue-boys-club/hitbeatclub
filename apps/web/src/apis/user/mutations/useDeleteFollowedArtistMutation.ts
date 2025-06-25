import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFollowedArtist } from "../user.api";
import { QUERY_KEYS } from "@/apis/query-keys";

export const useDeleteFollowedArtistMutation = (userId: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (artistId: number) => deleteFollowedArtist(userId, artistId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.followedArtists._key });
		},
	});
};
