import axiosInstance from "@/apis/api.client";
import type {
	PaymentCompleteRequest,
	PaymentOrderCreateRequest,
	PaymentCompletionResponse,
	PaymentOrderResponse,
} from "@hitbeatclub/shared-types/payment";
import { CommonResponseId, CommonResponsePaging, PaginationRequest } from "@hitbeatclub/shared-types/common";
import { CommonResponse, PaginationResponse } from "../api.type";
import { PlayerListResponse, PlayerStartRequest } from "@hitbeatclub/shared-types";

/**
 * 플레이어 상세 조회 API
 */
export const getPlayerList = async (pagination: PaginationRequest): Promise<PaginationResponse<PlayerListResponse>> => {
	const response = await axiosInstance.get<PaginationResponse<PlayerListResponse>>(`/player`, {
		params: pagination,
	});
	return response.data;
};

/**
 * 플레이어 상세 조회 API
 */
export const startPlayer = async (data: PlayerStartRequest): Promise<CommonResponseId> => {
	const response = await axiosInstance.post<CommonResponseId>(`/player/play`, data);
	return response.data;
};
