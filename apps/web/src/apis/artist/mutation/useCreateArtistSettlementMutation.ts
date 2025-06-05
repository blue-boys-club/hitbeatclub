import { useMutation } from "@tanstack/react-query";
import { createArtistSettlement } from "../artist.api";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/apis/query-keys";
import { SettlementCreateRequest } from "@hitbeatclub/shared-types/settlement";

export const useCreateArtistSettlementMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["artist", "settlement", "create"],
		mutationFn: ({ artistId, payload }: { artistId: number; payload: SettlementCreateRequest }) =>
			createArtistSettlement(artistId, payload),

		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.artist.me });
		},
	});
};
