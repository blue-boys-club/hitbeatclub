import { z } from "zod";

export const ProductResponseSchema = z.object({
	id: z.number().describe("상품 ID").default(1),
	name: z.string().describe("상품명").default("Sample Product"),
	description: z.string().describe("상품 설명").default("상품 설명입니다").optional(),
	price: z.number().describe("가격").default(10000),
	category: z.string().describe("카테고리").default("음악").optional(),
	imageUrl: z.string().url().describe("상품 이미지 URL").default("https://example.com/product.jpg").optional(),
	isActive: z.boolean().describe("활성 상태").default(true),
	createdAt: z.string().datetime().describe("생성 시간").default("2024-01-01T00:00:00Z"),
	updatedAt: z.string().datetime().describe("수정 시간").default("2024-01-01T00:00:00Z"),
});

export type ProductResponse = z.infer<typeof ProductResponseSchema>;

export const ProductListResponseSchema = z.object({
	products: z.array(ProductResponseSchema).describe("상품 목록").default([]),
	total: z.number().describe("전체 상품 수").default(0),
	page: z.number().describe("현재 페이지").default(1),
	limit: z.number().describe("페이지당 항목 수").default(10),
});

export type ProductListResponse = z.infer<typeof ProductListResponseSchema>;
