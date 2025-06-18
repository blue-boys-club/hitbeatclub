import axiosInstance from "@/apis/api.client";
import { CommonResponse } from "../api.type";
import { CouponValidateRequest, CouponValidateResponse } from "@hitbeatclub/shared-types";

/**
 * 쿠폰 코드 유효성 검사
 * @param payload 쿠폰 코드 유효성 검사 요청 페이로드
 * @returns 쿠폰 코드 유효성 검사 응답
 */
export const validateCoupon = async (payload: CouponValidateRequest) => {
	const response = await axiosInstance.post<CommonResponse<CouponValidateResponse>>("/coupon/validate", payload);
	return response.data;
};
