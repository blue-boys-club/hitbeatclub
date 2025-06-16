import axiosInstance from "@/apis/api.client";
import { CartCreateRequestSchema, CartListResponse, CartUpdateRequestSchema } from "@hitbeatclub/shared-types/cart";
import { CommonResponse, CommonResponseId } from "../api.type";
import { z } from "zod";
import { UpdateCartItemPayload } from "./cart.type";

/**
 * 장바구니 목록 조회
 * @returns 장바구니 목록
 */
export const getCartList = async () => {
	const response = await axiosInstance.get<CommonResponse<CartListResponse>>("/carts");
	return response.data;
};

/**
 * 장바구니 상품 추가
 * @param payload 장바구니 상품 추가 요청 데이터
 * @returns 장바구니 상품 추가 결과
 */
export const createCartItem = async (payload: z.input<typeof CartCreateRequestSchema>) => {
	const response = await axiosInstance.post<CommonResponseId>("/carts", payload);
	return response.data;
};

/**
 * 장바구니 상품 삭제
 * @param id 장바구니 상품 ID
 * @returns 장바구니 상품 삭제 결과
 */
export const deleteCartItem = async (id: number) => {
	const response = await axiosInstance.delete<CommonResponseId>(`/carts/${id}`);
	return response.data;
};

/**
 * 장바구니 상품 업데이트 (라이센스)
 * @param id 장바구니 상품 ID
 * @param payload 장바구니 상품 업데이트 요청 데이터
 * @returns 장바구니 상품 업데이트 결과
 */
export const updateCartItem = async ({ id, licenseId }: UpdateCartItemPayload) => {
	const response = await axiosInstance.patch<CommonResponseId>(`/carts/${id}`, { licenseId });
	return response.data;
};
