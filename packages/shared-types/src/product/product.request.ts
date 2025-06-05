import { z } from "zod";

const licenseTypeEnum = z.enum(["MASTER", "EXCLUSIVE"]);
const productSortEnum = z.enum(["RECENT", "RECOMMEND", "null"]);
export const productCategoryEnum = z.enum(["BEAT", "ACAPELA", "null"]);
const musicKeyEnum = z.enum([
	"C",
	"Db",
	"D",
	"Eb",
	"E",
	"F",
	"Gb",
	"G",
	"Ab",
	"A",
	"Bb",
	"B",
	"Cs",
	"Ds",
	"Fs",
	"Gs",
	"As",
	"null",
]);
const scaleTypeEnum = z.enum(["MAJOR", "MINOR", "null"]);

export const ProductCreateSchema = z.object({
	productName: z.string().min(1).max(255).default("Sample Product").describe("상품명"),
	description: z.string().max(1000).describe("곡 설명 /가사").default("곡 설명 /가사"),
	price: z.number().int().min(0).describe("가격").default(10000),
	category: productCategoryEnum.describe("카테고리(BEAT, ACAPELA) 기본값: BEAT").default(productCategoryEnum.enum.BEAT),
	genres: z.array(z.string()).max(100).describe("장르").default(["Hip-hop"]),
	tags: z.array(z.string()).describe("태그").optional().default(["tag"]),
	minBpm: z.number().int().describe("최소 BPM").optional().default(100),
	maxBpm: z.number().int().describe("최대 BPM").optional().default(120),
	musicKey: musicKeyEnum.describe("음계").optional().default(musicKeyEnum.enum.C),
	scaleType: scaleTypeEnum.describe("조성").optional().default(scaleTypeEnum.enum.MAJOR),
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
	page: z.string().transform(Number).pipe(z.number().min(1)).describe("1"),
	limit: z.string().transform(Number).pipe(z.number().min(1)).describe("10"),
	category: productCategoryEnum.optional().describe("BEAT"),
	sort: productSortEnum.optional().describe("RECENT"),
	genreIds: z.string().optional().describe("1,2"),
	tagIds: z.string().optional().describe("1,3"),
	musicKey: musicKeyEnum.optional().describe("C"),
	scaleType: scaleTypeEnum.optional().describe("MAJOR"),
	minBpm: z.string().transform(Number).pipe(z.number().int().optional()).describe("100").optional(),
	maxBpm: z.string().transform(Number).pipe(z.number().int().optional()).describe("120").optional(),
});

export type ProductCreateRequest = z.infer<typeof ProductCreateSchema>;
export type ProductUpdateRequest = z.infer<typeof ProductUpdateSchema>;
export type ProductListQueryRequest = z.infer<typeof ProductListQuerySchema>;
