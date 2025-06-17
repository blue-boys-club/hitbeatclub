import { useMutation } from "@tanstack/react-query";
import { completePayment } from "../payment.api";
import { MutationOptions } from "@tanstack/react-query";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { PaymentCompleteRequest, PaymentCompletionResponse } from "@hitbeatclub/shared-types/payment";

export const useCompletePaymentOrderMutation = (
	options?: MutationOptions<PaymentCompletionResponse, Error, PaymentCompleteRequest>,
) => {
	return useMutation({
		mutationFn: completePayment,
		mutationKey: MUTATION_KEYS.payment.completePayment,
		...options,
	});
};
