import { useMutation } from "@tanstack/react-query";
import { createTag } from "../tag.api";
import { TagCreateRequest } from "@hitbeatclub/shared-types/tag";
import { QUERY_KEYS } from "@/apis/query-keys";
import { useQueryClient } from "@tanstack/react-query";

export const useCreateTagMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: TagCreateRequest) => createTag(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tag.list });
		},
	});
};
