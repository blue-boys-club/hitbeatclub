import axiosInstance from "@/apis/api.client";
import { CartCreateRequestSchema, CartListResponse } from "@hitbeatclub/shared-types/cart";
import { CommonResponse, CommonResponseId } from "../api.type";
import { z } from "zod";

export const getCartList = async () => {
	const response = await axiosInstance.get<CommonResponse<CartListResponse[]>>("/carts");
	return response.data;
};

export const createCartItem = async (payload: z.input<typeof CartCreateRequestSchema>) => {
	const response = await axiosInstance.post<CommonResponseId>("/carts", payload);
	return response.data;
};

export const deleteCartItem = async (id: number) => {
	const response = await axiosInstance.delete<CommonResponseId>(`/carts/${id}`);
	return response.data;
};
