import { z } from "zod";
import { ProductListQuerySchema } from "../product/product.request";

export const ArtistCreateSchema = z.object({
	stageName: z.string().min(1).max(30).describe("스테이지명").default("DJ Cool"),
	slug: z.string().max(20).describe("슬러그").default("dj-cool").optional(),
	description: z.string().max(1000).describe("아티스트 설명").default("안녕하세요! DJ Cool입니다.").optional(),
	profileImageFileId: z.number().describe("프로필 이미지 파일 ID").optional(),
	instagramAccount: z.string().max(30).describe("인스타그램 계정").default("djcool").optional(),
	youtubeAccount: z.string().max(30).describe("유튜브 계정").default("djcool").optional(),
	tiktokAccount: z.string().max(30).describe("틱톡 계정").default("djcool").optional(),
	soundcloudAccount: z.string().max(30).describe("사운드클라우드 계정").default("djcool").optional(),
	etcAccounts: z
		.array(z.string().url())
		.nullable()
		.describe("기타 계정들")
		.default(["https://twitter.com/djcool"])
		.optional(),
	kakaoAccount: z.string().max(30).describe("카카오 계정").default("djcool").optional(),
	lineAccount: z.string().max(30).describe("라인 계정").default("djcool").optional(),
	discordAccount: z.string().max(30).describe("디스코드 계정").default("djcool#1234").optional(),
	country: z.string().max(3).describe("국가").default("KOR").optional(),
	city: z.string().max(100).describe("도시").default("서울").optional(),
});

export const ArtistUpdateSchema = ArtistCreateSchema.partial();

export type ArtistCreateRequest = z.infer<typeof ArtistCreateSchema>;
export type ArtistUpdateRequest = z.infer<typeof ArtistUpdateSchema>;

export const ArtistProductListQuerySchema = ProductListQuerySchema.extend({
	isPublic: z.coerce.boolean().optional(),
});

export type ArtistProductListQueryRequest = z.infer<typeof ArtistProductListQuerySchema>;
