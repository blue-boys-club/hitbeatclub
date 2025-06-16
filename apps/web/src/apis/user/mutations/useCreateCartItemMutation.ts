import { useMutation } from "@tanstack/react-query";
import { createCartItem } from "../user.api";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { QUERY_KEYS } from "@/apis/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { CartCreateRequestSchema } from "@hitbeatclub/shared-types";

export const useCreateCartItemMutation = (userId: number) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: z.input<typeof CartCreateRequestSchema>) => createCartItem(userId, payload),
		mutationKey: MUTATION_KEYS.cart.create,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart.list });
		},
	});
};
