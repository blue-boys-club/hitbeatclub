import axiosInstance from "@/apis/api.client";
import type {
	PaymentCompleteRequest,
	PaymentOrderCreateRequest,
	PaymentCompletionResponse,
	PaymentOrderResponse,
} from "@hitbeatclub/shared-types/payment";
import { CommonResponsePaging, PaginationRequest } from "@hitbeatclub/shared-types/common";
import { CommonResponse, PaginationResponse } from "../api.type";

/**
 * 결제 주문 생성 API
 * 카트의 아이템들로 결제 주문을 생성합니다.
 */
export const createPaymentOrder = async (
	data: PaymentOrderCreateRequest,
): Promise<CommonResponse<PaymentOrderResponse>> => {
	const response = await axiosInstance.post<CommonResponse<PaymentOrderResponse>>("/payment/order", data);
	return response.data;
};

/**
 * 결제 완료 처리 API
 * 포트원 결제 정보를 검증하고 주문을 완료 처리합니다.
 */
export const completePayment = async (
	data: PaymentCompleteRequest,
): Promise<CommonResponse<PaymentCompletionResponse>> => {
	const response = await axiosInstance.post<CommonResponse<PaymentCompletionResponse>>("/payment/complete", data);
	return response.data;
};

/**
 * 주문 상세 조회 API
 */
export const getOrder = async (orderId: number): Promise<CommonResponse<PaymentOrderResponse>> => {
	const response = await axiosInstance.get<CommonResponse<PaymentOrderResponse>>(`/payment/order/${orderId}`);
	return response.data;
};

/**
 * 사용자 주문 목록 조회 API
 */
export const getUserOrders = async (payload: PaginationRequest): Promise<PaginationResponse<PaymentOrderResponse>> => {
	const response = await axiosInstance.get<PaginationResponse<PaymentOrderResponse>>(`/payment/orders`, {
		params: payload,
	});
	return response.data;
};
