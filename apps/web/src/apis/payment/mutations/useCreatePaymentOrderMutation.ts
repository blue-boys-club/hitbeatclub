import { useMutation } from "@tanstack/react-query";
import { createPaymentOrder } from "../payment.api";
import { MutationOptions } from "@tanstack/react-query";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { PaymentOrderCreateRequest, PaymentOrderResponse } from "@hitbeatclub/shared-types/payment";

export const useCreatePaymentOrderMutation = (
	options?: MutationOptions<PaymentOrderResponse, Error, PaymentOrderCreateRequest>,
) => {
	return useMutation({
		mutationFn: createPaymentOrder,
		mutationKey: MUTATION_KEYS.payment.createOrder,
		...options,
	});
};
