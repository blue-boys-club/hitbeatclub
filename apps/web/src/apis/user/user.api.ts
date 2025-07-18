import { CommonResponse, CommonResponseId, PaginationResponse } from "@/apis/api.type";
import { CartCreateRequestSchema, CartListResponse, ProductLikeResponse } from "@hitbeatclub/shared-types";
import {
	UserFindMeResponse,
	UserLikeProductListRequest,
	UserUpdatePayload,
	UserUpdatePayloadSchema,
	UserProfileUpdatePayload,
	UserPasswordResetPayload,
	UserFollowArtistListResponse,
} from "@hitbeatclub/shared-types/user";
import axiosInstance from "@/apis/api.client";
import { z } from "zod";
import { UpdateCartItemPayload, UserFollowedArtistListPayload } from "./user.type";

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
export const leaveMe = async (userId: number, deleteReason: string): Promise<CommonResponseId> => {
	const response = await axiosInstance.delete<CommonResponseId>(`/users/${userId}`, {
		data: {
			deleteReason,
		},
	});
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
 * 유저 프로필 수정
 * @param userId 유저 아이디
 * @param data 프로필 업데이트 데이터
 * @returns 업데이트 결과
 */
export const updateUserProfile = async (userId: number, data: UserProfileUpdatePayload): Promise<CommonResponseId> => {
	const response = await axiosInstance.patch<CommonResponseId>(`/users/${userId}`, data);
	return response.data;
};

/**
 * 유저 비밀번호 재설정
 * @param userId 유저 아이디
 * @param data 비밀번호 업데이트 데이터
 * @returns 업데이트 결과
 */
export const updateUserPassword = async (userId: number, data: UserPasswordResetPayload): Promise<CommonResponseId> => {
	const response = await axiosInstance.patch<CommonResponseId>(`/users/${userId}/password`, data);
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
): Promise<PaginationResponse<ProductLikeResponse[]>> => {
	const response = await axiosInstance.get<PaginationResponse<ProductLikeResponse[]>>(
		`/users/${userId}/liked-products`,
		{
			params: payload,
		},
	);
	return response.data;
};

/**
 * 장바구니 목록 조회
 * @returns 장바구니 목록
 */
export const getCartList = async (userId: number) => {
	const response = await axiosInstance.get<CommonResponse<CartListResponse>>(`/users/${userId}/cart`);
	return response.data;
};

/**
 * 장바구니 상품 추가
 * @param payload 장바구니 상품 추가 요청 데이터
 * @returns 장바구니 상품 추가 결과
 */
export const createCartItem = async (userId: number, payload: z.input<typeof CartCreateRequestSchema>) => {
	const response = await axiosInstance.post<CommonResponseId>(`/users/${userId}/cart`, payload);
	return response.data;
};

/**
 * 장바구니 상품 삭제
 * @param id 장바구니 상품 ID
 * @returns 장바구니 상품 삭제 결과
 */
export const deleteCartItem = async (userId: number, cartItemId: number) => {
	const response = await axiosInstance.delete<CommonResponseId>(`/users/${userId}/cart/${cartItemId}`);
	return response.data;
};

/**
 * 장바구니 상품 업데이트 (라이센스)
 * @param id 장바구니 상품 ID
 * @param payload 장바구니 상품 업데이트 요청 데이터
 * @returns 장바구니 상품 업데이트 결과
 */
export const updateCartItem = async (userId: number, { id, licenseId }: UpdateCartItemPayload) => {
	const response = await axiosInstance.patch<CommonResponseId>(`/users/${userId}/cart/${id}`, { licenseId });
	return response.data;
};

/**
 * 팔로잉 아티스트 목록 조회
 * @param userId 유저 아이디
 * @param payload 팔로잉 아티스트 목록 조회 요청 데이터
 * @returns 팔로잉 아티스트 목록
 */
export const getFollowingArtists = async (userId: number, payload: UserFollowedArtistListPayload) => {
	const response = await axiosInstance.get<PaginationResponse<UserFollowArtistListResponse[]>>(
		`/users/${userId}/followed-artists`,
		{
			params: payload,
		},
	);
	return response.data;
};

/**
 * 팔로우 추가
 * @param userId 유저 아이디
 * @param artistId 아티스트 아이디
 * @returns 팔로우 추가 결과
 */
export const updateFollowedArtist = async (userId: number, artistId: number) => {
	const response = await axiosInstance.post(`/users/${userId}/followed-artists/${artistId}`);
	return response.data;
};

/**
 * 팔로우 취소
 * @param userId 유저 아이디
 * @param artistId 아티스트 아이디
 * @returns 팔로우 취소 결과
 */
export const deleteFollowedArtist = async (userId: number, artistId: number) => {
	const response = await axiosInstance.delete(`/users/${userId}/followed-artists/${artistId}`);
	return response.data;
};
