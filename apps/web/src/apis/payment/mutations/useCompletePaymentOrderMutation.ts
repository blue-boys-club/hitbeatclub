import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completePayment } from "../payment.api";
import { MutationOptions } from "@tanstack/react-query";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { PaymentCompleteRequest, PaymentCompletionResponse } from "@hitbeatclub/shared-types/payment";
import { QUERY_KEYS } from "@/apis/query-keys";
import { CommonResponse } from "@/apis/api.type";

export const useCompletePaymentOrderMutation = (
	options?: MutationOptions<CommonResponse<PaymentCompletionResponse>, Error, PaymentCompleteRequest>,
) => {
	const queryClient = useQueryClient();
	const { onSuccess, ...restOptions } = options ?? {};

	return useMutation({
		mutationFn: completePayment,
		mutationKey: MUTATION_KEYS.payment.completePayment,
		...restOptions,
		onSuccess: (data, variables, context) => {
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart.list });
			void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.payment._key });
			onSuccess?.(data, variables, context);
		},
	});
};
