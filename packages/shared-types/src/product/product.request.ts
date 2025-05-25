import { z } from "zod";

export const ProductCreateRequestSchema = z.object({
	name: z.string().min(1).max(100).describe("상품명").default("Sample Product"),
	description: z.string().max(1000).describe("상품 설명").default("상품 설명입니다").optional(),
	price: z.number().min(0).describe("가격").default(10000),
	category: z.string().max(50).describe("카테고리").default("음악").optional(),
	imageUrl: z.string().url().describe("상품 이미지 URL").default("https://example.com/product.jpg").optional(),
	isActive: z.boolean().describe("활성 상태").default(true),
});

export type ProductCreateRequest = z.infer<typeof ProductCreateRequestSchema>;

export const ProductUpdateRequestSchema = ProductCreateRequestSchema.partial();

export type ProductUpdateRequest = z.infer<typeof ProductUpdateRequestSchema>;
