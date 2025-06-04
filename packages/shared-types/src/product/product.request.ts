import { z } from "zod";

const licenseTypeEnum = z.enum(["MASTER", "EXCLUSIVE"]);
const productSortEnum = z.enum(["RECENT", "RECOMMEND", "null"]);
const productTypeEnum = z.enum(["BEAT", "ACAPELA", "null"]);

export const ProductCreateSchema = z.object({
	productName: z.string().min(1).max(255).default("Sample Product").describe("상품명"),
	description: z.string().max(1000).describe("곡 설명 /가사").default("곡 설명 /가사"),
	price: z.number().int().min(0).describe("가격").default(10000),
	type: z.string().max(10).describe("타입(BAET, ACAPELA) 기본값: BAET").default("BAET"),
	genres: z.array(z.string()).max(100).describe("장르").default(["Hip-hop"]),
	tags: z.array(z.string()).describe("태그").optional().default(["tag"]),
	bpm: z.number().int().describe("BPM").optional().default(120),
	tonality: z.string().max(10).describe("조성").optional().default("C"),
	licenseInfo: z
		.array(
			z.object({
				type: licenseTypeEnum.describe("라이선스 타입(MASTER, EXCLUSIVE)"),
				price: z.number().int().min(1).describe("라이선스 가격"),
			}),
		)
		.default([
			{
				type: "MASTER",
				price: 10000,
			},
			{
				type: "EXCLUSIVE",
				price: 20000,
			},
		])
		.describe("라이선스 정보"),
	currency: z.string().max(10).describe("통화").default("KRW"),
	coverImageFileId: z.number().describe("커버 이미지 URL").default(1).optional(),
	audioFileFileId: z.number().describe("오디오 파일 URL").default(2).optional(),
	zipFileId: z.number().describe("ZIP 파일 URL").default(3).optional(),
	isFreeDownload: z.number().describe("무료 다운로드 여부").default(0),
	isPublic: z.number().describe("공개 여부").default(0),
});

export const ProductUpdateSchema = ProductCreateSchema.partial();

export const ProductListQuerySchema = z.object({
	page: z.string().default("1").transform(Number).pipe(z.number().min(1)),
	limit: z.string().default("10").transform(Number).pipe(z.number().min(1)),
	type: productTypeEnum.default("BEAT").optional(),
	sort: productSortEnum.default("RECENT").optional(),
});

export type ProductCreateRequest = z.infer<typeof ProductCreateSchema>;
export type ProductUpdateRequest = z.infer<typeof ProductUpdateSchema>;
export type ProductListQueryRequest = z.infer<typeof ProductListQuerySchema>;
