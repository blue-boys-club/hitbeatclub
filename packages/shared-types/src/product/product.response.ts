import { z } from "zod";
import { productCategoryEnum } from "./product.request";
import { CommonResponsePagingSchema } from "../common/common.response";

export const ProductResponseSchema = z.object({
	id: z.number().describe("상품 ID").default(8),
	productName: z.string().describe("상품명").default("Sample Product"),
	description: z.string().describe("상품 설명").default("곡 설명 /가사"),
	// price: z.number().describe("가격").default(10000),
	category: productCategoryEnum.describe("카테고리").default("BEAT"),
	createdAt: z.string().datetime().describe("생성 시간").default("2025-06-04T17:12:58.000Z"),
	minBpm: z.number().describe("최소 BPM").default(100),
	maxBpm: z.number().describe("최대 BPM").default(200),
	isFreeDownload: z
		.number()
		.min(0)
		.max(1)
		.transform((val) => val === 1)
		.describe("무료 다운로드 여부")
		.default(0),
	isLiked: z
		.number()
		.min(0)
		.max(1)
		.transform((val) => val === 1)
		.nullable()
		.describe("좋아요 여부")
		.default(null),
	musicKey: z.string().describe("음계").default("C"),
	scaleType: z.string().describe("조성").default("MAJOR"),
	genres: z
		.array(
			z.object({
				id: z.number().describe("장르 ID"),
				name: z.string().describe("장르명"),
			}),
		)
		.default([{ id: 1, name: "Hip-hop" }]),
	tags: z
		.array(
			z.object({
				id: z.number().describe("태그 ID"),
				name: z.string().describe("태그명"),
			}),
		)
		.default([{ id: 1, name: "tag" }]),

	seller: z.object({
		id: z.number().describe("판매자 ID").default(1),
		stageName: z.string().describe("판매자 닉네임").default("판매자"),
		slug: z.string().nullable().describe("판매자 슬러그").default("notjake"),
		profileImageUrl: z.string().url().describe("판매자 프로필 이미지 URL").default("https://example.com/profile.jpg"),
		isVerified: z.coerce.boolean().nullable().describe("인증 여부"),
	}),
	licenseInfo: z.array(
		z.object({
			id: z.number().describe("라이센스 ID").default(1),
			label: z.string().describe("라이센스 타입").default("Master"),
			price: z.number().describe("라이센스 가격").default(0),
		}),
	),
	coverImage: z
		.object({
			id: z.number().describe("커버 이미지 ID").default(1),
			url: z.string().url().describe("커버 이미지 URL").default("https://example.com/cover.jpg"),
			originName: z.string().describe("커버 이미지 원본 이름").default("cover.jpg"),
		})
		.nullable(),
});

export const ProductListResponseSchema = ProductResponseSchema.extend({
	audioFile: z
		.object({
			id: z.number().describe("오디오 파일 ID").default(1),
			url: z.string().url().describe("오디오 파일 URL").default("https://example.com/audio.mp3"),
			originName: z.string().describe("오디오 파일 원본 이름").default("audio.mp3"),
		})
		.nullable(),
}).describe("상품 목록");

export const ProductRowByDashboardSchema = z.object({
	id: z.number().describe("상품 ID").default(13),
	productName: z.string().describe("상품명").default("Baby, show you instrumental (Em bpm60)"),
	licenseInfo: z.array(
		z.object({
			label: z.string().describe("라이센스 타입").default("Master"),
			price: z.number().describe("라이센스 가격").default(0),
		}),
	),
	coverImage: z.object({
		id: z.number().describe("커버 이미지 ID").default(40),
		url: z
			.string()
			.url()
			.describe("커버 이미지 URL")
			.default("https://prod-assets.hitbeatclub.com/product/ebcaf2e3-c18d-4738-8b7b-4a21e051dd36"),
		originName: z.string().describe("커버 이미지 원본 이름").default("333.jpg"),
	}),
	audioFile: z.object({
		id: z.number().describe("오디오 파일 ID").default(1),
		url: z.string().url().describe("오디오 파일 URL").default("https://example.com/audio.mp3"),
		originName: z.string().describe("오디오 파일 원본 이름").default("audio.mp3"),
	}),
	seller: z.object({
		id: z.number().describe("판매자 ID").default(21),
		slug: z.string().nullable().describe("판매자 슬러그").default("notjake"),
		isVerified: z.coerce.boolean().nullable().describe("인증 여부"),
		stageName: z.string().describe("판매자 닉네임").default("NotJake"),
		profileImageUrl: z.string().url().describe("판매자 프로필 이미지 URL").default("https://example.com/profile.jpg"),
	}),
	genres: z.array(z.string()).describe("장르 목록"),
	tags: z.array(z.string()).describe("태그 목록"),
	createdAt: z.string().datetime().describe("생성 시간").default("2025-06-12T09:10:36.000Z"),
});

export const ProductListDashboardResponseSchema = z.object({
	all: z.array(ProductRowByDashboardSchema),
	beat: z.array(ProductRowByDashboardSchema),
	acappella: z.array(ProductRowByDashboardSchema),
	recommended: z.array(ProductRowByDashboardSchema),
	recent: z.array(ProductRowByDashboardSchema),
});

export const ProductListPagingResponseSchema = CommonResponsePagingSchema.extend({
	data: z.array(ProductListResponseSchema),
});

export const ProductDetailResponseSchema = z.object({
	...ProductResponseSchema.shape,
	seller: z.object({
		id: z.number().describe("판매자 ID").default(1),
		stageName: z.string().describe("판매자 닉네임").default("판매자"),
		slug: z.string().nullable().describe("판매자 슬러그").default("notjake"),
		profileImageUrl: z.string().url().describe("판매자 프로필 이미지 URL").default("https://example.com/profile.jpg"),
		isVerified: z.coerce.boolean().nullable().describe("인증 여부"),
	}),
	audioFile: z.object({
		id: z.number().describe("오디오 파일 ID").default(1),
		url: z.string().url().describe("오디오 파일 URL").default("https://example.com/audio.mp3"),
		originName: z.string().describe("오디오 파일 원본 이름").default("audio.mp3"),
	}),
	coverImage: z.object({
		id: z.number().describe("커버 이미지 ID").default(1),
		url: z.string().url().describe("커버 이미지 URL").default("https://example.com/cover.jpg"),
		originName: z.string().describe("커버 이미지 원본 이름").default("cover.jpg"),
	}),
	zipFile: z.object({
		id: z.number().describe("ZIP 파일 ID").default(1),
		url: z.string().url().describe("ZIP 파일 URL").default("https://example.com/zip.zip"),
		originName: z.string().describe("ZIP 파일 원본 이름").default("zip.zip"),
	}),
	licenseInfo: z
		.array(
			z.object({
				id: z.number().describe("라이센스 ID"),
				type: z.enum(["MASTER", "EXCLUSIVE"]).describe("라이센스 타입"),
				price: z.number().describe("라이센스 가격"),
			}),
		)
		.describe("라이센스 정보")
		.default([
			{ id: 1, type: "MASTER", price: 50000 },
			{ id: 2, type: "EXCLUSIVE", price: 30000 },
		]),
});

export const ProductSearchInfoResponseSchema = z.object({
	genres: z.array(
		z.object({
			id: z.number().describe("장르 ID"),
			name: z.string().describe("장르명"),
			count: z.number().describe("장르 개수"),
		}),
	),
	tags: z.array(
		z.object({
			id: z.number().describe("태그 ID"),
			name: z.string().describe("태그명"),
			count: z.number().describe("태그 개수"),
		}),
	),
});

export const ProductLikeResponseSchema = z.object({
	id: z.number().describe("상품 ID").default(13),
	productName: z.string().describe("상품명").default("Baby, show you instrumental (Em bpm60)"),
	category: z.string().describe("카테고리").default("BEAT"),
	minBpm: z.number().describe("최소 BPM").default(60),
	maxBpm: z.number().describe("최대 BPM").default(60),
	musicKey: z.string().describe("음계").default("E"),
	scaleType: z.string().describe("조성").default("MINOR"),
	createdAt: z.string().datetime().describe("생성 시간").default("2025-06-12T09:10:36.000Z"),
	likedAt: z.string().datetime().describe("좋아요 시간").default("2025-06-21T09:41:35.000Z"),
	seller: z.object({
		id: z.number().describe("판매자 ID").default(21),
		stageName: z.string().describe("판매자 닉네임").default("NotJake"),
		slug: z.string().nullable().describe("판매자 슬러그").default("notjake"),
		isVerified: z.coerce.boolean().nullable().describe("인증 여부"),
		profileImageUrl: z.string().url().describe("판매자 프로필 이미지 URL").default("https://example.com/profile.jpg"),
	}),
	genres: z.array(z.string()).describe("장르 목록"),
	tags: z.array(z.string()).describe("태그 목록"),
	licenseInfo: z.array(
		z.object({
			id: z.number().describe("라이센스 ID").default(1),
			label: z.string().describe("라이센스 타입").default("MASTER"),
			price: z.number().describe("라이센스 가격").default(10000),
		}),
	),
	audioFile: z.object({
		id: z.number().describe("오디오 파일 ID").default(26),
		url: z
			.string()
			.url()
			.describe("오디오 파일 URL")
			.default("https://prod-assets.hitbeatclub.com/product/6c42daef-71d3-416f-a5f4-681ab122f853"),
		originName: z
			.string()
			.describe("오디오 파일 원본 이름")
			.default("NotJake - Baby, show you instrumental (Em bpm60).mp3"),
	}),
	coverImage: z.object({
		id: z.number().describe("커버 이미지 ID").default(40),
		url: z
			.string()
			.url()
			.describe("커버 이미지 URL")
			.default("https://prod-assets.hitbeatclub.com/product/ebcaf2e3-c18d-4738-8b7b-4a21e051dd36"),
		originName: z.string().describe("커버 이미지 원본 이름").default("333.jpg"),
	}),
});

export const ProductAutoCompleteArtistResponseSchema = z.object({
	type: z.literal("ARTIST"),
	id: z.number().describe("아티스트 ID").default(1),
	stageName: z.string().describe("아티스트 닉네임").default("아티스트"),
	profileImageUrl: z.string().url().describe("아티스트 프로필 이미지 URL").default("https://example.com/profile.jpg"),
	slug: z.string().describe("아티스트 슬러그").default("artist-slug"),
});

export const ProductAutoCompleteProductResponseSchema = z.object({
	type: z.literal("PRODUCT"),
	id: z.number().describe("상품 ID").default(1),
	productName: z.string().describe("상품명").default("상품명"),
	productImageUrl: z.string().url().describe("상품 이미지 URL").default("https://example.com/product.jpg"),
});

export const ProductAutoCompleteResponseSchema = z.discriminatedUnion("type", [
	ProductAutoCompleteArtistResponseSchema,
	ProductAutoCompleteProductResponseSchema,
]);

export type ProductListPagingResponse = z.infer<typeof ProductListPagingResponseSchema>;
export type ProductResponse = z.infer<typeof ProductResponseSchema>;
export type ProductDetailResponse = z.infer<typeof ProductDetailResponseSchema>;
export type ProductSearchInfoResponse = z.infer<typeof ProductSearchInfoResponseSchema>;
export type ProductListDashboardResponse = z.infer<typeof ProductListDashboardResponseSchema>;
export type ProductRowByDashboardResponse = z.infer<typeof ProductRowByDashboardSchema>;
export type ProductAutoCompleteArtistResponse = z.infer<typeof ProductAutoCompleteArtistResponseSchema>;
export type ProductAutoCompleteProductResponse = z.infer<typeof ProductAutoCompleteProductResponseSchema>;
export type ProductAutoCompleteResponse = z.infer<typeof ProductAutoCompleteResponseSchema>;
export type ProductLikeResponse = z.infer<typeof ProductLikeResponseSchema>;
