import { useMutation } from "@tanstack/react-query";
import { createPaymentOrder } from "../payment.api";
import { MutationOptions } from "@tanstack/react-query";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { PaymentOrderCreateRequest, PaymentOrderResponse } from "@hitbeatclub/shared-types/payment";
import { CommonResponse } from "@/apis/api.type";

export const useCreatePaymentOrderMutation = (
	options?: MutationOptions<CommonResponse<PaymentOrderResponse>, Error, PaymentOrderCreateRequest>,
) => {
	return useMutation({
		mutationFn: createPaymentOrder,
		mutationKey: MUTATION_KEYS.payment.createOrder,
		...options,
	});
};
