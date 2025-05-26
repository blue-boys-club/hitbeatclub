import type { CommonResponse as SharedCommonResponse } from "@hitbeatclub/shared-types/common";

export interface CommonResponse<T> extends SharedCommonResponse {
	data: T;
}

export interface ErrorResponse {
	title: string;
	code: string;
	status: number;
	detail?: string;
}
