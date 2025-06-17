import { useMutation } from "@tanstack/react-query";
import { updateFollowedArtist } from "../user.api";
import { QUERY_KEYS } from "@/apis/query-keys";
import { useQueryClient } from "@tanstack/react-query";

export const useUpdateFollowedArtistMutation = (userId: number) => {
	return useMutation({
		mutationFn: (artistId: number) => updateFollowedArtist(userId, artistId),
	});
};
