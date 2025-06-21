import axiosInstance from "../api.client";
import {
	NoticePayload,
	NoticeListResponse,
	NoticeDetailResponse,
	NoticeUpdateResponse,
	NoticeCreateResponse,
	UploadFileResponse,
	NoticeUpdatePayload,
	NoticeCreatePayload,
	UploadFilePayload,
} from "./notice.type";

export const getNoticeList = async (payload: NoticePayload) => {
	const response = await axiosInstance.get<NoticeListResponse>(`/notices`, { params: payload });
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

export const updateNotice = async (id: string, payload: NoticeUpdatePayload) => {
	const response = await axiosInstance.put<NoticeUpdateResponse>(`/notices/${id}`, payload);
	return response.data;
};

export const uploadFile = async (payload: UploadFilePayload) => {
	const formData = new FormData();
	formData.append("type", payload.type);
	formData.append("file", payload.file);
	const response = await axiosInstance.post<UploadFileResponse>(`/notices/file`, formData);
	return response.data;
};

export const createNotice = async (payload: NoticeCreatePayload) => {
	const response = await axiosInstance.post<NoticeCreateResponse>(`/notices`, payload);
	return response.data;
};
