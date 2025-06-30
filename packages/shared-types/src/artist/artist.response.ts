import { z } from "zod";
import { SettlementResponseSchema } from "../settlement";

export const ArtistResponseSchema = z.object({
	id: z.number().describe("아티스트 ID").default(1),
	userId: z.number().describe("사용자 ID").default(1),
	stageName: z.string().nullable().describe("스테이지명").default("DJ 스파이더"),
	slug: z.string().nullable().describe("슬러그").default("dj-spider"),
	viewCount: z.number().describe("조회수").default(0),
	followerCount: z.number().describe("팔로워 수").default(0),
	trackCount: z.number().describe("트랙 수").default(0),
	soldTrackCount: z.number().describe("판매한 트랙 수").default(0),
	isVerified: z.coerce.boolean().nullable().describe("인증 여부").default(false),
	description: z.string().nullable().describe("아티스트 설명").default("한국의 유명 DJ이자 프로듀서"),
	profileImageUrl: z.string().nullable().describe("프로필 이미지 URL").default("https://example.com/profile.jpg"),
	instagramAccount: z.string().nullable().describe("인스타그램 계정").default("djspider"),
	youtubeAccount: z.string().nullable().describe("유튜브 계정").default("djspider"),
	tiktokAccount: z.string().nullable().describe("틱톡 계정").default("djspider"),
	soundcloudAccount: z.string().nullable().describe("사운드클라우드 계정").default("djspider"),
	etcAccounts: z.array(z.string()).nullable().describe("기타 계정들").default(["https://spotify.com/djspider"]),
	kakaoAccount: z.string().nullable().describe("카카오 계정").default("djspider"),
	lineAccount: z.string().nullable().describe("라인 계정").default("djspider"),
	discordAccount: z.string().nullable().describe("디스코드 계정").default("djspider#1234"),
	country: z.string().nullable().describe("국가").default("대한민국"),
	city: z.string().nullable().describe("도시").default("서울"),
	settlement: SettlementResponseSchema.nullable().describe("정산 정보"),
	profileImage: z
		.object({
			id: z.number().describe("프로필 이미지 ID").default(1),
			url: z.string().nullable().describe("프로필 이미지 URL").default("https://example.com/profile.jpg"),
		})
		.nullable()
		.describe("프로필 이미지"),
	createdAt: z.date().nullable().describe("생성일").default(new Date("2024-01-01")),
	updatedAt: z.date().nullable().describe("수정일").default(new Date("2024-01-01")),
	deletedAt: z.date().nullable().describe("삭제일").default(null),
	subscribe: z
		.object({
			id: z.number().describe("구독 ID").default(1),
			userId: z.number().describe("사용자 ID").default(1),
			couponId: z.number().nullable().describe("쿠폰 ID").default(null),
			subscriptionPlan: z.string().describe("구독 플랜").default("YEAR"),
			productType: z.string().describe("상품 타입").default("MEMBERSHIP"),
			price: z.number().describe("가격").default(239880),
			nextPaymentDate: z.date().nullable().describe("다음 결제일").default(null),
			status: z.string().describe("상태").default("ACTIVE"),
			cancelledAt: z.date().nullable().describe("취소일").default(null),
			createdAt: z.date().describe("생성일").default(new Date("2025-06-26T11:22:12.000Z")),
			updatedAt: z.date().describe("수정일").default(new Date("2025-06-26T11:22:12.000Z")),
			deletedAt: z.date().nullable().describe("삭제일").default(null),
		})
		.nullable()
		.describe("구독 정보"),
});

export const ArtistListResponseSchema = z.object({
	id: z.number().describe("아티스트 ID").default(1),
	name: z.string().nullable().describe("아티스트 이름").default("DJ 스파이더"),
	profileImageUrl: z.string().nullable().describe("프로필 이미지 URL").default("https://example.com/profile.jpg"),
});

export const ArtistPublicResponseSchema = ArtistResponseSchema.pick({
	id: true,
	stageName: true,
	slug: true,
	profileImageUrl: true,
	profileImage: true,
	description: true,
	country: true,
	city: true,
	instagramAccount: true,
	youtubeAccount: true,
	tiktokAccount: true,
	soundcloudAccount: true,
	etcAccounts: true,
	kakaoAccount: true,
	lineAccount: true,
	discordAccount: true,
	createdAt: true,
	updatedAt: true,
});

export const ArtistBlockResponseSchema = z.object({
	id: z.number().describe("차단 기록 ID").default(1),
	artistId: z.number().describe("차단된 아티스트 ID").default(123),
	isBlocked: z.boolean().describe("차단 상태").default(true),
});

// 아티스트 신고 응답 스키마
export const ArtistReportResponseSchema = z.object({
	id: z.number().describe("신고 ID").default(1),
	artistId: z.number().describe("신고된 아티스트 ID").default(123),
	message: z.string().describe("응답 메시지").default("신고가 성공적으로 접수되었습니다."),
});

export const ReportStatusEnum = z.enum(["PENDING", "REVIEWING", "RESOLVED", "REJECTED"]);

export const ArtistReportListResponseSchema = z.object({
	id: z.number().describe("신고 ID").default(1),
	artistId: z.number().describe("신고된 아티스트 ID").default(123),
	artistStageName: z.string().nullable().describe("아티스트 스테이지명").default("DJ Cool"),
	reporterName: z.string().describe("신고자 이름").default("홍길동"),
	reporterEmail: z.string().email().describe("신고자 이메일").default("reporter@example.com"),
	content: z.string().describe("신고 내용").default("부적절한 콘텐츠입니다."),
	status: ReportStatusEnum.describe("처리 상태").default("PENDING"),
	createdAt: z.date().describe("신고일").default(new Date()),
	processedAt: z.date().nullable().describe("처리일").default(null),
});

export type ArtistReportResponse = z.infer<typeof ArtistReportResponseSchema>;
export type ArtistReportListResponse = z.infer<typeof ArtistReportListResponseSchema>;
export type ArtistBlockResponse = z.infer<typeof ArtistBlockResponseSchema>;
export type ArtistResponse = z.infer<typeof ArtistResponseSchema>;
export type ArtistPublicResponse = z.infer<typeof ArtistPublicResponseSchema>;
export type ArtistListResponse = z.infer<typeof ArtistListResponseSchema>;
