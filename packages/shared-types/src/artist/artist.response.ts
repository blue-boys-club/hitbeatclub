import { z } from "zod";
import { ENUM_ARTIST_SETTLEMENT_BANK } from "./artist.request";

export const ArtistSettlementResponseSchema = z.union([
	z.object({
		type: z.literal("BANK_ACCOUNT"),
		accountHolder: z.string().min(1).max(100).describe("입금주 명").default("김민준"),
		accountNumber: z.string().min(1).max(100).describe("계좌번호").default("1231234567890"),
		accountBank: z.enum(ENUM_ARTIST_SETTLEMENT_BANK).describe("은행").default("BANK_OF_KOREA"),
	}),
	z.object({
		type: z.literal("PAYPAL"),
		accountHolder: z.string().min(1).max(100).describe("입금주 명").default("김민준"),
		paypalAccount: z.string().email().min(1).max(100).describe("페이팔 계정").default("djcool@gmail.com"),
	}),
]);

export const ArtistResponseSchema = z.object({
	id: z.number().describe("아티스트 ID").default(1),
	userId: z.number().describe("사용자 ID").default(1),
	stageName: z.string().nullable().describe("스테이지명").default("DJ 스파이더"),
	slug: z.string().nullable().describe("슬러그").default("dj-spider"),
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
	settlement: ArtistSettlementResponseSchema.nullable().describe("정산 정보"),
	createdAt: z.date().nullable().describe("생성일").default(new Date("2024-01-01")),
	updatedAt: z.date().nullable().describe("수정일").default(new Date("2024-01-01")),
	deletedAt: z.date().nullable().describe("삭제일").default(null),
});

export type ArtistResponse = z.infer<typeof ArtistResponseSchema>;
