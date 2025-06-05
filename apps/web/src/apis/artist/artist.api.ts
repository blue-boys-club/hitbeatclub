import axiosInstance from "@/apis/api.client";
import { ArtistCreateRequest, ArtistResponse, ArtistUpdateRequest } from "@hitbeatclub/shared-types/artist";
import type { CommonResponse, CommonResponseId } from "@/apis/api.type";
import { ArtistUploadProfileRequest } from "./artist.type";
import { FileUploadResponse } from "@hitbeatclub/shared-types/file";
import { SettlementCreateRequest, SettlementUpdateRequest } from "@hitbeatclub/shared-types/settlement";

/**
 * 아티스트 내 정보 조회
 * @returns 아티스트 정보
 */
export const getArtistMe = async () => {
	const response = await axiosInstance.get<CommonResponse<ArtistResponse>>(`/artists/me`);
	return response.data;
};

/**
 * 아티스트 상세 조회
 * @param id 아티스트 아이디
 * @returns 아티스트 정보
 */
export const getArtistDetail = async (id: number) => {
	const response = await axiosInstance.get<CommonResponse<ArtistResponse>>(`/artists/${id}`);
	return response.data;
};

/**
 * 아티스트 생성
 * @param payload 아티스트 생성 페이로드
 * @returns 아티스트 생성 결과
 */
export const createArtist = async (payload: ArtistCreateRequest) => {
	const response = await axiosInstance.post(`/artists`, payload);
	return response.data;
};

/**
 * 아티스트 수정
 * @param id 아티스트 아이디
 * @param payload 아티스트 수정 페이로드
 * @returns 아티스트 수정 결과
 */
export const updateArtist = async (id: number, payload: ArtistUpdateRequest) => {
	const response = await axiosInstance.patch(`/artists/${id}`, payload);
	return response.data;
};

export const uploadArtistProfile = async (payload: ArtistUploadProfileRequest) => {
	const formData = new FormData();
	formData.append("file", payload.file);
	formData.append("type", payload.type);

	const response = await axiosInstance.post<CommonResponse<FileUploadResponse>>(`/artists/profile`, formData);
	return response.data;
};

export const createArtistSettlement = async (id: number, payload: SettlementCreateRequest) => {
	const response = await axiosInstance.post<CommonResponseId>(`/artists/${id}/settlement`, payload);
	return response.data;
};

export const updateArtistSettlement = async (id: number, payload: SettlementUpdateRequest) => {
	const response = await axiosInstance.patch<CommonResponseId>(`/artists/${id}/settlement`, payload);
	return response.data;
};
