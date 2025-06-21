import { useMutation } from "@tanstack/react-query";
import { CouponValidateRequest } from "@hitbeatclub/shared-types";
import { validateCoupon } from "../coupon.api";

export const useValidateCouponMutation = () => {
	return useMutation({
		mutationFn: (payload: CouponValidateRequest) => validateCoupon(payload),
		onSuccess: () => {},
	});
};
