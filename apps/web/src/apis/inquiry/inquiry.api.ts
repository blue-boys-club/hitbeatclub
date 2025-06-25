import {
	InquiryCreateRequest,
	InquiryDetailResponse,
	InquiryListResponse,
	InquiryUpdateRequest,
} from "@hitbeatclub/shared-types";
import axiosInstance from "../api.client";
import { CommonResponse, CommonResponseId } from "../api.type";

/**
 * 문의 목록 조회
 * @returns 문의 목록
 */
export const getInquiryList = async () => {
	const response = await axiosInstance.get<CommonResponse<InquiryListResponse>>("/inquiries");
	return response.data;
};

/**
 * 문의 상세 조회
 * @param id 문의 ID
 * @returns 문의 상세 정보
 */
export const getInquiryDetail = async (id: number) => {
	const response = await axiosInstance.get<CommonResponse<InquiryDetailResponse>>(`/inquiries/${id}`);
	return response.data;
};

/**
 * 문의 생성
 * @param payload 문의 생성 요청 데이터
 * @returns 문의 생성 정보
 */
export const createInquiry = async (payload: InquiryCreateRequest) => {
	const response = await axiosInstance.post<CommonResponseId>("/inquiries", payload);
	return response.data;
};

/**
 * 문의 수정
 * @param id 문의 ID
 * @param payload 문의 수정 요청 데이터
 * @returns 문의 수정 정보
 */
export const updateInquiry = async (id: number, payload: InquiryUpdateRequest) => {
	const response = await axiosInstance.put<CommonResponseId>(`/inquiries/${id}`, payload);
	return response.data;
};

/**
 * 문의 삭제
 * @param id 문의 ID
 * @returns 문의 삭제 정보
 */
export const deleteInquiry = async (id: number) => {
	const response = await axiosInstance.delete<CommonResponseId>(`/inquiries/${id}`);
	return response.data;
};
