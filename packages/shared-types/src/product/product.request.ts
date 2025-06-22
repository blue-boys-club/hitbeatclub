import { z } from "zod";

export const licenseInfo = [
	{
		id: 1,
		type: "MASTER",
		label: "Master",
	},
	{
		id: 2,
		type: "EXCLUSIVE",
		label: "Exclusive",
	},
];

export const licenseTypeEnum = z.enum(["MASTER", "EXCLUSIVE"]);
export const productSortEnum = z.enum(["RECENT", "RECOMMEND", "null"]);
export const productCategoryEnum = z.enum(["BEAT", "ACAPELA", "null"]);
export const musicKeyEnum = z.enum([
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
export const scaleTypeEnum = z.enum(["MAJOR", "MINOR", "null"]);

export const ProductCreateSchema = z.object({
	productName: z.string().min(1, "필수 입력사항 입니다.").max(255).default("Sample Product").describe("상품명"),
	description: z.string().max(1000, "필수 입력사항 입니다.").describe("곡 설명 /가사").default("곡 설명 /가사"),
	price: z.number().int().min(0, "필수 입력사항 입니다.").describe("가격").default(10000),
	category: productCategoryEnum.describe("카테고리(BEAT, ACAPELA) 기본값: BEAT").default(productCategoryEnum.enum.BEAT),
	genres: z.array(z.string()).max(100, "최대 100개의 장르를 선택할 수 있습니다.").describe("장르").default(["Hip-hop"]),
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
	page: z.coerce.number().min(1).describe("1"),
	limit: z.coerce.number().min(1).describe("10"),
	category: productCategoryEnum.optional().describe("BEAT"),
	sort: productSortEnum.optional().describe("RECENT"),
	genreIds: z
		.union([z.array(z.coerce.number()), z.coerce.number().transform((val) => [val])])
		.refine((val) => !val || val.length <= 3, { message: "최대 3개의 장르만 선택할 수 있습니다." })
		.optional()
		.describe("1,2"),
	tagIds: z
		.union([z.array(z.coerce.number()), z.coerce.number().transform((val) => [val])])
		.optional()
		.describe("1,3"),
	musicKey: musicKeyEnum.optional().describe("C"),
	scaleType: scaleTypeEnum.optional().describe("MAJOR"),
	minBpm: z.coerce.number().int().optional().describe("100").optional(),
	maxBpm: z.coerce.number().int().optional().describe("120").optional(),
	// select: z.array(z.string()).optional().describe("필터링할 필드명 배열"),
});

export const ProductSearchQuerySchema = ProductListQuerySchema.extend({
	keyword: z.string().optional().describe("검색어"),
});

export const ProductAutocompleteSearchQuerySchema = z.object({
	keyword: z.string().optional().describe("검색어"),
});

export type ProductCreateRequest = z.infer<typeof ProductCreateSchema>;
export type ProductUpdateRequest = z.infer<typeof ProductUpdateSchema>;
export type ProductListQueryRequest = z.infer<typeof ProductListQuerySchema>;
export type ProductSearchQueryRequest = z.infer<typeof ProductSearchQuerySchema>;
export type ProductAutocompleteSearchQueryRequest = z.infer<typeof ProductAutocompleteSearchQuerySchema>;
