import { useMutation } from "@tanstack/react-query";
import { updateArtistSettlement } from "../artist.api";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/apis/query-keys";
import { SettlementUpdateRequest } from "@hitbeatclub/shared-types/settlement";

export const useUpdateArtistSettlementMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["artist", "settlement", "update"],
		mutationFn: ({ artistId, payload }: { artistId: number; payload: SettlementUpdateRequest }) =>
			updateArtistSettlement(artistId, payload),

		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.artist.me });
		},
	});
};
