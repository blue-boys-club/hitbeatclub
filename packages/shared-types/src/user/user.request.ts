import { z } from "zod";
import { PaginationRequestSchema } from "../common/common.request";
import { musicKeyEnum, productCategoryEnum, scaleTypeEnum } from "../product/product.request";

export const UserCreatePayloadSchema = z.object({
	email: z.string().email().describe("이메일"),
});

export type UserCreatePayload = z.infer<typeof UserCreatePayloadSchema>;

export const UserUpdatePayloadSchema = z.object({
	name: z.string().min(1).max(100).default("John Doe").describe("사용자 이름"),
	stageName: z.string().min(1).max(30).default("DJ Cool").optional().describe("활동명"),
	email: z.string().email().describe("이메일").default("test@gmail.com"),
	password: z.string().min(8).max(255).describe("비밀번호").optional(),
	phoneNumber: z.string().max(11).describe("전화번호").default("01012345678"),
	gender: z.enum(["M", "F"]).describe("성별 (M/F)").default("M").optional(),
	birthDate: z.string().datetime().describe("생년월일").default("1990-01-01T00:00:00Z"),
	profileUrl: z
		.string()
		.url()
		.max(255)
		.describe("프로필 이미지 URL")
		.default("https://example.com/profile.jpg")
		.optional(),
	country: z.string().max(4).describe("국가 코드").default("KR").optional(),
	region: z.string().max(100).describe("지역").default("Seoul").optional(),
	isAgreedTerms: z
		.number()
		.describe("이용약관 동의 여부")
		.default(1)
		.refine((val) => val === 1, {
			message: "이용약관에 동의해야 합니다",
		}),
	isAgreedPrivacyPolicy: z
		.number()
		.describe("개인정보처리방침 동의 여부")
		.default(1)
		.refine((val) => val === 1, {
			message: "개인정보처리방침에 동의해야 합니다",
		}),
	isAgreedEmail: z.number().describe("이메일 수신 동의 여부").optional().default(0),
	musicType: z.enum(["BEAT", "ACAPELLA"]).describe("음악 타입").optional(),
});

export type UserUpdatePayload = z.infer<typeof UserUpdatePayloadSchema>;

export const UserLikeProductListRequestSchema = PaginationRequestSchema.extend({
	sort: z.enum(["RECENT", "POPULAR", "NAME"]).optional().default("RECENT"),
	search: z.string().optional(),
	category: productCategoryEnum.optional().describe("BEAT"),
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
});

export type UserLikeProductListRequest = z.infer<typeof UserLikeProductListRequestSchema>;

export const UserFollowArtistListRequestSchema = PaginationRequestSchema.extend({
	sort: z.enum(["RECENT", "POPULAR", "NAME"]).optional().default("RECENT"),
	search: z.string().optional().describe("아티스트 이름 검색"),
});

export type UserFollowArtistListRequest = z.infer<typeof UserFollowArtistListRequestSchema>;

export const UserFollowArtistRequestSchema = z.object({
	artistId: z.coerce.number().positive().describe("팔로잉할 아티스트 ID"),
});

export type UserFollowArtistRequest = z.infer<typeof UserFollowArtistRequestSchema>;

export const UserUnfollowArtistRequestSchema = z.object({
	artistId: z.coerce.number().positive().describe("언팔로우할 아티스트 ID"),
});

export type UserUnfollowArtistRequest = z.infer<typeof UserUnfollowArtistRequestSchema>;

export const UserProfileUpdatePayloadSchema = z.object({
	name: z.string().min(1).max(100).describe("사용자 이름").optional().default("John Doe"),
	stageName: z.string().min(1).max(30).describe("활동명").optional().default("DJ Cool"),
	phoneNumber: z.string().max(11).describe("전화번호").optional().default("01012345678"),
	birthDate: z.string().datetime().describe("생년월일").optional().default("1990-01-01T00:00:00Z"),
	gender: z.enum(["M", "F"]).describe("성별 (M/F)").optional().default("M"),
	country: z.string().max(4).describe("국가 코드").optional().default("KR"),
	region: z.string().max(100).describe("지역").optional().default("Seoul"),

	isAgreedEmail: z.coerce.boolean().describe("이메일 수신 동의 여부").optional().default(false),
});

export type UserProfileUpdatePayload = z.infer<typeof UserProfileUpdatePayloadSchema>;

export const UserDeletePayloadSchema = z.object({
	deletedReason: z.string().min(1).max(255).describe("탈퇴 사유").default("개인정보 보호"),
});

export type UserDeletePayload = z.infer<typeof UserDeletePayloadSchema>;

export const UserPasswordResetPayloadSchema = z
	.object({
		currentPassword: z.string().min(8).max(255).describe("현재 비밀번호"),
		newPassword: z.string().min(8).max(255).describe("새 비밀번호"),
		confirmPassword: z.string().min(8).max(255).describe("비밀번호 확인"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "새 비밀번호와 비밀번호 확인이 일치하지 않습니다",
		path: ["confirmPassword"],
	});

export type UserPasswordResetPayload = z.infer<typeof UserPasswordResetPayloadSchema>;
