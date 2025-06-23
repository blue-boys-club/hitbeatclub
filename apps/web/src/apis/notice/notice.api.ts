import {
	NoticeCreateRequest,
	NoticeCreateResponse,
	NoticeDetailResponse,
	NoticeFileResponse,
	NoticeListPagingResponse,
	NoticeListQueryRequest,
	NoticeUpdateRequest,
	NoticeUploadFileRequest,
} from "@hitbeatclub/shared-types";
import axiosInstance from "../api.client";
import { UploadFilePayload, UploadFileResponse } from "./notice.type";

export const getNoticeList = async (payload: NoticeListQueryRequest) => {
	const response = await axiosInstance.get<NoticeListPagingResponse>(`/notices`, { params: payload });
	return response.data;
};

export const getNoticeDetail = async (id: string) => {
	const response = await axiosInstance.get<NoticeDetailResponse>(`/notices/${id}`);
	return response.data;
};

export const deleteNotice = async (id: string) => {
	const response = await axiosInstance.delete<NoticeDetailResponse>(`/notices/${id}`);
	return response.data;
};

export const updateNotice = async (id: string, payload: NoticeUpdateRequest) => {
	const response = await axiosInstance.put<NoticeCreateResponse>(`/notices/${id}`, payload);
	return response.data;
};

export const uploadFile = async (payload: UploadFilePayload) => {
	const formData = new FormData();
	formData.append("type", payload.type);
	formData.append("file", payload.file);
	const response = await axiosInstance.post<UploadFileResponse>(`/notices/file`, formData);
	return response.data;
};

export const createNotice = async (payload: NoticeCreateRequest) => {
	const response = await axiosInstance.post<NoticeCreateResponse>(`/notices`, payload);
	return response.data;
};
