import axiosInstance from "@/apis/api.client";
import {
	ArtistCreateRequest,
	ArtistProductListQueryRequest,
	ArtistResponse,
	ArtistUpdateRequest,
	ArtistProductListQuerySchema,
} from "@hitbeatclub/shared-types/artist";
import type { CommonResponse, CommonResponseId } from "@/apis/api.type";
import { ArtistUploadProfileRequest } from "./artist.type";
import { FileUploadResponse } from "@hitbeatclub/shared-types/file";
import { SettlementCreateRequest, SettlementUpdateRequest } from "@hitbeatclub/shared-types/settlement";
import { ProductListPagingResponse } from "@hitbeatclub/shared-types/product";
import { deepRemoveDefaults } from "@/lib/schema.utils";

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
 * 아티스트 상세 조회 (slug 기준)
 * @param slug 아티스트 슬러그
 * @returns 아티스트 정보
 */
export const getArtistDetailBySlug = async (slug: string) => {
	const response = await axiosInstance.get<CommonResponse<ArtistResponse>>(`/artists/slug/${slug}`);
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

/**
 * 아티스트 프로필 이미지 업로드
 * @param payload 아티스트 프로필 이미지 업로드 페이로드
 * @returns 아티스트 프로필 이미지 업로드 결과
 */
export const uploadArtistProfile = async (payload: ArtistUploadProfileRequest) => {
	const formData = new FormData();
	formData.append("file", payload.file);
	formData.append("type", payload.type);

	const response = await axiosInstance.post<CommonResponse<FileUploadResponse>>(`/artists/profile`, formData);
	return response.data;
};

/**
 * 아티스트 정산 데이터 생성
 * @param id 아티스트 아이디
 * @param payload 아티스트 정산 데이터 생성 페이로드
 * @returns 아티스트 정산 데이터 생성 결과
 */
export const createArtistSettlement = async (id: number, payload: SettlementCreateRequest) => {
	const response = await axiosInstance.post<CommonResponseId>(`/artists/${id}/settlement`, payload);
	return response.data;
};

/**
 * 아티스트 정산 데이터 업데이트
 * @param id 아티스트 아이디
 * @param payload 아티스트 정산 데이터 업데이트 페이로드
 * @returns 아티스트 정산 데이터 업데이트 결과
 */
export const updateArtistSettlement = async (id: number, payload: SettlementUpdateRequest) => {
	const response = await axiosInstance.patch<CommonResponseId>(`/artists/${id}/settlement`, payload);
	return response.data;
};

/**
 * 아티스트 컨텐츠 목록 조회
 * @param id 아티스트 아이디
 * @returns 아티스트 컨텐츠 목록
 */
export const getArtistContentList = async (id: number, payload: ArtistProductListQueryRequest) => {
	try {
		const parsed = deepRemoveDefaults(ArtistProductListQuerySchema).parse(payload);
		const response = await axiosInstance.get<ProductListPagingResponse>(`/artists/${id}/products`, {
			params: parsed,
			// paramsSerializer: { indexes: null },
		});
		return response.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

/**
 * 아티스트 컨텐츠 목록 조회 (slug 기준)
 * @param slug 아티스트 슬러그
 * @returns 아티스트 컨텐츠 목록
 */
export const getArtistContentListBySlug = async (slug: string, payload: ArtistProductListQueryRequest) => {
	try {
		const parsed = deepRemoveDefaults(ArtistProductListQuerySchema).parse(payload);
		const response = await axiosInstance.get<ProductListPagingResponse>(`/artists/slug/${slug}/products`, {
			params: parsed,
			// paramsSerializer: { indexes: null },
		});
		return response.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

/**
 * 아티스트 차단
 * @param id 아티스트 아이디
 * @returns 아티스트 차단 결과
 */
export const blockArtist = async (id: number) => {
	const response = await axiosInstance.post<CommonResponseId>(`/artists/${id}/block`);
	return response.data;
};

/**
 * 아티스트 차단 해제
 * @param id 아티스트 아이디
 * @returns 아티스트 차단 해제 결과
 */
export const unblockArtist = async (id: number) => {
	const response = await axiosInstance.delete<CommonResponseId>(`/artists/${id}/block`);
	return response.data;
};
