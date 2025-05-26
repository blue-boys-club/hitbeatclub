import { z } from "zod";

export const ArtistResponseSchema = z.object({
	id: z.number().describe("아티스트 ID"),
	userId: z.number().describe("사용자 ID"),
	stageName: z.string().nullable().describe("스테이지명"),
	slug: z.string().nullable().describe("슬러그"),
	description: z.string().nullable().describe("아티스트 설명"),
	profileImageUrl: z.string().nullable().describe("프로필 이미지 URL"),
	instagramAccount: z.string().nullable().describe("인스타그램 계정"),
	youtubeAccount: z.string().nullable().describe("유튜브 계정"),
	tiktokAccount: z.string().nullable().describe("틱톡 계정"),
	soundcloudAccount: z.string().nullable().describe("사운드클라우드 계정"),
	kakaoAccount: z.string().nullable().describe("카카오 계정"),
	lineAccount: z.string().nullable().describe("라인 계정"),
	discordAccount: z.string().nullable().describe("디스코드 계정"),
	country: z.string().nullable().describe("국가"),
	city: z.string().nullable().describe("도시"),
	createdAt: z.date().nullable().describe("생성일"),
	updatedAt: z.date().nullable().describe("수정일"),
	deletedAt: z.date().nullable().describe("삭제일"),
});

export type ArtistResponse = z.infer<typeof ArtistResponseSchema>;
