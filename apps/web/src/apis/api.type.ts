import type {
	CommonResponse as SharedCommonResponse,
	CommonResponsePaging as SharedCommonResponsePaging,
} from "@hitbeatclub/shared-types/common";
export type { CommonResponseId } from "@hitbeatclub/shared-types/common";

export interface CommonResponse<T> extends SharedCommonResponse {
	data: T;
}

export interface PaginationResponse<T> extends SharedCommonResponsePaging {
	data: T;
}

export interface ErrorResponse {
	title: string;
	code: string;
	status: number;
	detail?: string;
}
