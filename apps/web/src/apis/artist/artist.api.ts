import axiosInstance from "@/apis/api.client";
import { ArtistCreatePayload, ArtistDetailResponse, ArtistMeResponse, ArtistUpdatePayload } from "./artist.type";
import type { CommonResponse } from "@/apis/api.type";

/**
 * 아티스트 내 정보 조회
 * @returns 아티스트 정보
 */
export const getArtistMe = async () => {
	const response = await axiosInstance.get<CommonResponse<ArtistMeResponse>>(`/artist/me`);
	return response.data;
};

/**
 * 아티스트 상세 조회
 * @param id 아티스트 아이디
 * @returns 아티스트 정보
 */
export const getArtistDetail = async (id: number) => {
	const response = await axiosInstance.get<CommonResponse<ArtistDetailResponse>>(`/artist/${id}`);
	return response.data;
};

/**
 * 아티스트 생성
 * @param payload 아티스트 생성 페이로드
 * @returns 아티스트 생성 결과
 */
export const createArtist = async (payload: ArtistCreatePayload) => {
	const response = await axiosInstance.post(`/artist`, payload);
	return response.data;
};

/**
 * 아티스트 수정
 * @param id 아티스트 아이디
 * @param payload 아티스트 수정 페이로드
 * @returns 아티스트 수정 결과
 */
export const updateArtist = async (id: number, payload: ArtistUpdatePayload) => {
	const response = await axiosInstance.patch(`/artist/${id}`, payload);
	return response.data;
};
