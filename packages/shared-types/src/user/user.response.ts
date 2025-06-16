import { z } from "zod";
import { UserUpdatePayloadSchema } from "./user.request";

export const UserUpdateResponseSchema = z.object({
	id: z.number().describe("사용자 ID").default(1),
	message: z.string().describe("업데이트 결과 메시지").default("사용자 정보가 성공적으로 업데이트되었습니다"),
});

export const UserFindMeResponseSchema = UserUpdatePayloadSchema.omit({
	password: true,
	isAgreedTerms: true,
	isAgreedPrivacyPolicy: true,
	isAgreedEmail: true,
}).extend({
	id: z.number().describe("사용자 ID"),
	agreedTermsAt: z.date().describe("이용약관 동의 일시"),
	agreedPrivacyPolicyAt: z.date().describe("개인정보처리방침 동의 일시"),
	agreedEmailAt: z.date().describe("이메일 수신 동의 일시"),
	subscribedAt: z.date().describe("구독 시작 일시").nullable().default(new Date("2025-05-27T00:00:00.000Z")),
});

export type UserFindMeResponse = z.infer<typeof UserFindMeResponseSchema>;

export type UserUpdateResponse = z.infer<typeof UserUpdateResponseSchema>;

export const UserFollowedArtistResponseSchema = z.object({
	id: z.number().describe("팔로잉 ID"),
	artistId: z.number().describe("아티스트 ID"),
	status: z.enum(["active", "blocked"]).describe("팔로잉 상태"),
	createdAt: z.date().describe("팔로잉 시작 일시"),
	artist: z
		.object({
			id: z.number().describe("아티스트 ID"),
			stageName: z.string().nullable().describe("아티스트 스테이지명"),
			profileImageUrl: z.string().nullable().describe("아티스트 프로필 이미지"),
			isVerified: z.number().describe("인증 상태"),
			description: z.string().nullable().describe("아티스트 설명"),
			country: z.string().nullable().describe("국가"),
			city: z.string().nullable().describe("도시"),
		})
		.describe("아티스트 정보"),
});

export type UserFollowedArtistResponse = z.infer<typeof UserFollowedArtistResponseSchema>;

export const UserFollowArtistListResponseSchema = z.object({
	artistId: z.number().describe("아티스트 ID"),
	stageName: z.string().nullable().describe("아티스트 스테이지명"),
	profileImageUrl: z.string().nullable().describe("아티스트 프로필 이미지"),
	followerCount: z.number().describe("팔로워 수"),
});

export type UserFollowArtistListResponse = z.infer<typeof UserFollowArtistListResponseSchema>;

export const UserFollowArtistResponseSchema = z.object({
	id: z.number().describe("팔로잉 ID"),
	artistId: z.number().describe("아티스트 ID"),
	createdAt: z.date().describe("팔로잉 시작 일시"),
	updatedAt: z.date().describe("팔로잉 업데이트 일시"),
	deletedAt: z.date().describe("팔로잉 삭제 일시").nullable(),
});

export type UserFollowArtistResponse = z.infer<typeof UserFollowArtistResponseSchema>;
