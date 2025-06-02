import { z } from "zod";

export const ArtistCreateSchema = z.object({
	stageName: z.string().min(1).max(30).describe("스테이지명"),
	slug: z.string().max(20).describe("슬러그").optional(),
	description: z.string().max(1000).describe("아티스트 설명").optional(),
	profileImageUrl: z.string().max(255).describe("프로필 이미지 URL").optional(),
	instagramAccount: z.string().max(30).describe("인스타그램 계정").optional(),
	youtubeAccount: z.string().max(30).describe("유튜브 계정").optional(),
	tiktokAccount: z.string().max(30).describe("틱톡 계정").optional(),
	soundcloudAccount: z.string().max(30).describe("사운드클라우드 계정").optional(),
	etcAccounts: z.array(z.string().max(255)).describe("기타 계정 목록").optional(),
	kakaoAccount: z.string().max(30).describe("카카오 계정").optional(),
	lineAccount: z.string().max(30).describe("라인 계정").optional(),
	discordAccount: z.string().max(30).describe("디스코드 계정").optional(),
	country: z.string().max(3).describe("국가").optional(),
	city: z.string().max(100).describe("도시").optional(),
});

export const ArtistUpdateSchema = ArtistCreateSchema.partial();

export type ArtistCreateRequest = z.infer<typeof ArtistCreateSchema>;
export type ArtistUpdateRequest = z.infer<typeof ArtistUpdateSchema>;
