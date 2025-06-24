import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { useMutation } from "@tanstack/react-query";
import { reportArtist } from "../artist.api";
import { ArtistReportRequest } from "@hitbeatclub/shared-types";

export const useReportArtistMutation = () => {
	return useMutation({
		mutationKey: ["artist", "report"],
		mutationFn: ({ id, payload }: { id: number; payload: ArtistReportRequest }) => reportArtist(id, payload),
	});
};
