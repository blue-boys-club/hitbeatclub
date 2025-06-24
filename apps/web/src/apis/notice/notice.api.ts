import {
	NoticeCreateRequest,
	NoticeCreateResponse,
	NoticeDetailResponse,
	NoticeListPagingResponse,
	NoticeListQueryRequest,
	NoticeUpdateRequest,
	NoticeUploadFileRequest,
	FileUploadResponse,
} from "@hitbeatclub/shared-types";
import axiosInstance from "../api.client";
import { UploadFilePayload } from "./notice.type";
import { CommonResponse, CommonResponseId } from "@/apis/api.type";

export const getNoticeList = async (payload: NoticeListQueryRequest) => {
	const response = await axiosInstance.get<NoticeListPagingResponse>(`/notices`, { params: payload });
	return response.data;
};

export const getNoticeDetail = async (id: string): Promise<CommonResponse<NoticeDetailResponse>> => {
	const response = await axiosInstance.get<CommonResponse<NoticeDetailResponse>>(`/notices/${id}`);
	return response.data;
};

export const deleteNotice = async (id: string): Promise<CommonResponseId> => {
	const response = await axiosInstance.delete<CommonResponseId>(`/notices/${id}`);
	return response.data;
};

export const updateNotice = async (
	id: string,
	payload: NoticeUpdateRequest,
): Promise<CommonResponse<NoticeCreateResponse>> => {
	const response = await axiosInstance.put<CommonResponse<NoticeCreateResponse>>(`/notices/${id}`, payload);
	return response.data;
};

export const uploadFile = async (payload: UploadFilePayload): Promise<CommonResponse<FileUploadResponse>> => {
	const formData = new FormData();
	formData.append("type", payload.type);
	formData.append("file", payload.file);
	const response = await axiosInstance.post<CommonResponse<FileUploadResponse>>(`/notices/file`, formData);

	return response.data;
};

export const createNotice = async (payload: NoticeCreateRequest): Promise<CommonResponse<NoticeCreateResponse>> => {
	const response = await axiosInstance.post<CommonResponse<NoticeCreateResponse>>(`/notices`, payload);
	return response.data;
};
