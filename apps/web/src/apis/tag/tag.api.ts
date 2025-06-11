import axiosInstance from "@/apis/api.client";
import { TagCreateRequest, TagListResponse, TagResponse } from "@hitbeatclub/shared-types/tag";
import { CommonResponse } from "../api.type";

export const getTagList = async () => {
	const response = await axiosInstance.get<CommonResponse<TagListResponse>>("/tags");
	return response.data;
};

export const createTag = async (payload: TagCreateRequest) => {
	const response = await axiosInstance.post<CommonResponse<TagResponse>>("/tags", payload);
	return response.data;
};
