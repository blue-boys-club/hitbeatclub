import { useMutation } from "@tanstack/react-query";
import { blockArtist } from "../artist.api";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/apis/query-keys";

export const useBlockArtistMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["artist", "block"],
		mutationFn: ({ artistId }: { artistId: number }) => blockArtist(artistId),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.me });
		},
	});
};
