import { ProductListResponseSchema } from "../product";
import { z } from "zod";

// 검색 결과에서 아티스트 구조 정의
export const SearchArtistSchema = z.object({
	id: z.number().describe("아티스트 ID"),
	stageName: z.string().describe("아티스트 무대명"),
	slug: z.string().describe("아티스트 슬러그"),
	profileImageUrl: z.string().nullable().describe("프로필 이미지 URL"),
});

// 검색 결과 전체 구조 정의
export const SearchResultResponseSchema = z.object({
	products: z.array(ProductListResponseSchema).describe("상품 목록"),
	artists: z.array(SearchArtistSchema).describe("아티스트 목록"),
	total: z.number().describe("전체 검색 결과 수 (상품 + 아티스트)"),
});
