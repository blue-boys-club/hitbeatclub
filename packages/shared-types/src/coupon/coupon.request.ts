import { z } from "zod";

// 쿠폰 코드 검증 스키마
export const CouponValidateRequestSchema = z.object({
	code: z.string().min(1, "쿠폰 코드를 입력해주세요.").describe("쿠폰 코드"),
});

// 타입 추출
export type CouponValidateRequest = z.infer<typeof CouponValidateRequestSchema>;
