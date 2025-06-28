import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePlaylist } from "../playlist.api";
import { PlaylistUpdateRequest } from "@hitbeatclub/shared-types";
import { QUERY_KEYS } from "@/apis/query-keys";
import { MUTATION_KEYS } from "@/apis/mutation-keys";

export const useUpdatePlaylistMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updatePlaylist,

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.playlist.userPlaylist });
		},
	});
};
