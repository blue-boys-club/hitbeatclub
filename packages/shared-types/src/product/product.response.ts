import { z } from "zod";

export const ProductResponseSchema = z.object({
	id: z.number().describe("상품 ID").default(1),
	type: z.enum(["audio", "video", "zip"]).describe("상품 타입").default("audio"),
	productName: z.string().describe("상품명").default("Sample Product"),
	description: z.string().describe("상품 설명").default("상품 설명입니다").optional(),
	price: z.number().describe("가격").default(10000),
	category: z.string().describe("카테고리").default("음악").optional(),
	isActive: z.boolean().describe("활성 상태").default(true),
	createdAt: z.string().datetime().describe("생성 시간").default("2024-01-01T00:00:00Z"),
});

export const ProductListResponseSchema = z.object({
	_metadata: z.object({
		statusCode: z.number().describe("상태 코드").default(200),
		message: z.string().describe("메시지").default("상품 조회 성공"),
	}),
	_pagination: z.object({
		totalPage: z.number().describe("총 페이지 수").default(1),
		total: z.number().describe("총 상품 수").default(0),
	}),
	data: z
		.array(
			z.object({
				...ProductResponseSchema.shape,
				seller: z.object({
					id: z.number().describe("판매자 ID").default(1),
					stageName: z.string().describe("판매자 닉네임").default("판매자"),
					profileImageUrl: z
						.string()
						.url()
						.describe("판매자 프로필 이미지 URL")
						.default("https://example.com/profile.jpg"),
				}),
				audioFile: z.object({
					id: z.number().describe("오디오 파일 ID").default(1),
					url: z.string().url().describe("오디오 파일 URL").default("https://example.com/audio.mp3"),
				}),
				coverImage: z.object({
					id: z.number().describe("커버 이미지 ID").default(1),
					url: z.string().url().describe("커버 이미지 URL").default("https://example.com/cover.jpg"),
				}),
			}),
		)
		.describe("상품 목록")
		.default([]),
});

export const ProductDetailResponseSchema = z.object({
	...ProductResponseSchema.shape,
	seller: z.object({
		id: z.number().describe("판매자 ID").default(1),
		stageName: z.string().describe("판매자 닉네임").default("판매자"),
		profileImageUrl: z.string().url().describe("판매자 프로필 이미지 URL").default("https://example.com/profile.jpg"),
	}),
	audioFile: z.object({
		id: z.number().describe("오디오 파일 ID").default(1),
		url: z.string().url().describe("오디오 파일 URL").default("https://example.com/audio.mp3"),
	}),
	coverImage: z.object({
		id: z.number().describe("커버 이미지 ID").default(1),
		url: z.string().url().describe("커버 이미지 URL").default("https://example.com/cover.jpg"),
	}),
});

export type ProductListResponse = z.infer<typeof ProductListResponseSchema>;
export type ProductResponse = z.infer<typeof ProductResponseSchema>;
export type ProductDetailResponse = z.infer<typeof ProductDetailResponseSchema>;
