import { z } from "zod";

// 쿠폰 할인 타입 스키마
export const CouponDiscountTypeSchema = z.enum(["PERCENT", "AMOUNT"]).describe("할인 타입");

// 쿠폰 검증 응답 스키마
export const CouponValidateResponseSchema = z.object({
	id: z.string().describe("쿠폰 ID"),
	code: z.string().describe("쿠폰 코드"),
	name: z.string().describe("쿠폰 이름"),
	discountType: CouponDiscountTypeSchema.describe("할인 타입"),
	discountValue: z.number().describe("할인 값"),
	validFromAt: z.date().nullable().describe("유효 시작일"),
	validUntilAt: z.date().nullable().describe("유효 종료일"),
	usageLimit: z.number().nullable().describe("사용 제한 횟수"),
	usedCount: z.number().describe("사용된 횟수"),
	isActive: z.boolean().describe("활성화 상태"),
});

// 타입 추출
export type CouponDiscountType = z.infer<typeof CouponDiscountTypeSchema>;
export type CouponValidateResponse = z.infer<typeof CouponValidateResponseSchema>;
