import axiosInstance from "@/apis/api.client";
import { SubscribeCreateResponse, SubscribeRequest } from "@hitbeatclub/shared-types/subscribe";
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
