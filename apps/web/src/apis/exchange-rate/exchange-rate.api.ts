import axiosInstance from "@/apis/api.client";
import { CommonResponse } from "@/apis/api.type";
import { ExchangeRateResponse } from "@hitbeatclub/shared-types";

export const getExchangeRateLatest = async (base: string = "KRW", target: string = "USD") => {
	const response = await axiosInstance.get<CommonResponse<ExchangeRateResponse>>(`/exchange-rates`, {
		params: { base, target },
	});
	return response.data;
};
