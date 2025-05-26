import { BaseResponse } from "@/apis/api.type";
import { UpdateUserRequest, UploadUserPhotoRequest, UploadUserPhotoResponse, UserMeResponse } from "./user.type";
import axiosInstance from "@/apis/api.client";

/**
 * 내 정보 조회
 * @returns 내 정보
 */
export const getUserMe = async (): Promise<BaseResponse<UserMeResponse>> => {
	const response = await axiosInstance.get<BaseResponse<UserMeResponse>>("/user/me");
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
export const leaveMe = async (userId: number): Promise<BaseResponse<void>> => {
	const response = await axiosInstance.delete<BaseResponse<void>>(`/user/${userId}`);
	return response.data;
};

// /**
//  * 로그아웃
//  * @returns 로그아웃
//  */
// export const logoutMe = async (): Promise<BaseResponse<void>> => {
// 	const response = await axiosInstance.post<BaseResponse<void>>("/user/logout");
// 	return response.data;
// };

/**
 * 유저 정보 수정
 * @param userId 유저 아이디
 * @param data 유저 정보
 * @returns 유저 정보
 */
export const updateUser = async (userId: number, data: UpdateUserRequest): Promise<BaseResponse<UserMeResponse>> => {
	const response = await axiosInstance.patch<BaseResponse<UserMeResponse>>(`/user/${userId}`, data);
	return response.data;
};
