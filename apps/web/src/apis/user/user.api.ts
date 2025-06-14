import { CommonResponse, CommonResponseId, PaginationResponse } from "@/apis/api.type";
import { ProductRowByDashboardResponse } from "@hitbeatclub/shared-types";
import {
	UserFindMeResponse,
	UserLikeProductListRequest,
	UserLikeProductListRequestSchema,
	UserUpdatePayload,
	UserUpdatePayloadSchema,
} from "@hitbeatclub/shared-types/user";
import axiosInstance from "@/apis/api.client";

/**
 * 내 정보 조회
 * @returns 내 정보
 */
export const getUserMe = async (): Promise<CommonResponse<UserFindMeResponse>> => {
	const response = await axiosInstance.get<CommonResponse<UserFindMeResponse>>("/users/me");
	return response.data;
};

// /**
//  * 회원 탈퇴
//  * @returns 회원 탈퇴
//  */
// export const leaveMe = async (): Promise<BaseResponse<void>> => {
// 	const response = await axiosInstance.delete<BaseResponse<void>>("/users/leave");
// 	return response.data;
// };

/**
 * 회원 탈퇴
 */
export const leaveMe = async (userId: number): Promise<CommonResponseId> => {
	const response = await axiosInstance.delete<CommonResponseId>(`/users/${userId}`);
	return response.data;
};

// /**
//  * 로그아웃
//  * @returns 로그아웃
//  */
// export const logoutMe = async (): Promise<BaseResponse<void>> => {
// 	const response = await axiosInstance.post<BaseResponse<void>>("/users/logout");
// 	return response.data;
// };

// /**
//  * 유저 정보 수정
//  * @param userId 유저 아이디
//  * @param data 유저 정보
//  * @returns 유저 정보
//  */
// export const updateUser = async (
// 	userId: number,
// 	data: UserUpdatePayload,
// ): Promise<CommonResponse<UserFindMeResponse>> => {
// 	const response = await axiosInstance.patch<CommonResponse<UserFindMeResponse>>(`/users/${userId}`, data);
// 	return response.data;
// };

/**
 * social join
 * @param userId 유저 아이디
 * @param data 유저 정보
 * @returns 유저 정보
 */
export const socialJoinUser = async (userId: number, data: UserUpdatePayload): Promise<CommonResponseId> => {
	const parsed = UserUpdatePayloadSchema.parse(data);
	const response = await axiosInstance.patch<CommonResponseId>(`/users/${userId}/social-join`, parsed);
	return response.data;
};

/**
 * 좋아요 상품 조회
 * @param userId 유저 아이디
 * @returns 좋아요 상품 목록
 */
export const getLikedProducts = async (
	userId: number,
	payload: UserLikeProductListRequest,
): Promise<PaginationResponse<ProductRowByDashboardResponse[]>> => {
	const response = await axiosInstance.get<PaginationResponse<ProductRowByDashboardResponse[]>>(
		`/users/${userId}/liked-products`,
		{
			params: payload,
		},
	);
	return response.data;
};
