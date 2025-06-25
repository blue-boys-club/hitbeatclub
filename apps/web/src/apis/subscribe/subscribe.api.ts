import axiosInstance from "@/apis/api.client";
import {
	SubscribeCancelRequest,
	SubscribePlanUpdateRequest,
	// SubscribeCancelResponse,
	SubscribeCreateResponse,
	SubscribePlansResponse,
	SubscribeRequest,
} from "@hitbeatclub/shared-types/subscribe";
import { CommonResponse } from "../api.type";

/**
 * 멤버십 구독
 * @param payload 구독 생성 요청 페이로드
 * @returns 구독 생성 응답
 */
export const subscribeMembership = async (payload: SubscribeRequest) => {
	const response = await axiosInstance.post<CommonResponse<SubscribeCreateResponse>>("/subscribe", payload);
	return response.data;
};

/**
 * 맴버십 종류 조회
 * @returns 맴버십 종류 응답
 */
export const getSubscribePlans = async () => {
	const response = await axiosInstance.get<CommonResponse<SubscribePlansResponse>>("/subscribe/plans");
	return response.data;
};

/**
 * 맴버십 취소
 * @param payload 맴버십 취소 요청 페이로드
 * @returns 맴버십 취소 응답
 */
export const cancelSubscribe = async (payload: SubscribeCancelRequest) => {
	const response = await axiosInstance.post<CommonResponse<void>>("/subscribe/cancel", payload);
	return response.data;
};

/**
 * 맴버십 플랜 변경
 * @param payload 맴버십 플랜 변경 요청 페이로드
 * @returns 맴버십 플랜 변경 응답
 */
export const updateSubscribePlan = async (payload: SubscribePlanUpdateRequest) => {
	const response = await axiosInstance.patch<CommonResponse<void>>("/subscribe", payload);
	return response.data;
};
