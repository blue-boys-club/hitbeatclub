import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unblockArtist } from "../artist.api";
import { QUERY_KEYS } from "@/apis/query-keys";

export const useUnblockArtistMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["artist", "unblock"],
		mutationFn: ({ artistId }: { artistId: number }) => unblockArtist(artistId),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.me });
		},
	});
};
