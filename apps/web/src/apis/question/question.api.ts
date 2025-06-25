import {
	CommonResponseId,
	QuestionCreateRequest,
	QuestionDetailResponse,
	QuestionListResponse,
	QuestionUpdateRequest,
} from "@hitbeatclub/shared-types";
import axiosInstance from "../api.client";
import { CommonResponse } from "../api.type";

/**
 * 질문 목록 조회
 * @returns 질문 목록
 */
export const getQuestions = async (): Promise<CommonResponse<QuestionListResponse>> => {
	const response = await axiosInstance.get<CommonResponse<QuestionListResponse>>("/questions");
	return response.data;
};

/**
 * 질문 상세 조회
 * @param id 질문 ID
 * @returns 질문 상세 정보
 */
export const getQuestionDetail = async (id: number): Promise<CommonResponse<QuestionDetailResponse>> => {
	const response = await axiosInstance.get<CommonResponse<QuestionDetailResponse>>(`/questions/${id}`);
	return response.data;
};

/**
 * 질문 생성
 * @param payload 질문 생성 요청 데이터
 * @returns 질문 생성 정보
 */
export const createQuestion = async (payload: QuestionCreateRequest): Promise<CommonResponseId> => {
	const response = await axiosInstance.post<CommonResponseId>("/questions", payload);
	return response.data;
};

/**
 * 질문 수정
 * @param id 질문 ID
 * @param payload 질문 수정 요청 데이터
 * @returns 질문 수정 정보
 */
export const updateQuestion = async (id: number, payload: QuestionUpdateRequest): Promise<CommonResponseId> => {
	const response = await axiosInstance.patch<CommonResponseId>(`/questions/${id}`, payload);
	return response.data;
};

/**
 * 질문 삭제
 * @param id 질문 ID
 * @returns 질문 삭제 정보
 */
export const deleteQuestion = async (id: number): Promise<CommonResponseId> => {
	const response = await axiosInstance.delete<CommonResponseId>(`/questions/${id}`);
	return response.data;
};
