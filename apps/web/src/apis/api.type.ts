export interface BaseResponse<T> {
	status: number;
	message: string;
	data: T;
}

export interface ErrorResponse {
	title: string;
	code: string;
	status: number;
	detail?: string;
}
