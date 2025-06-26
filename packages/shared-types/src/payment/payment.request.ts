import { z } from "zod";

// 결제 완료 요청 스키마
export const PaymentCompleteRequestSchema = z.object({
	paymentId: z.string().min(1, "결제 ID를 입력해주세요").describe("결제 ID"),
});

export type PaymentCompleteRequest = z.infer<typeof PaymentCompleteRequestSchema>;

// 결제 주문 생성 요청 스키마
export const PaymentOrderCreateRequestSchema = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("CART"),
		paymentId: z.string().min(1, "결제 ID를 입력해주세요").describe("결제 ID (클라이언트에서 생성한 고유 ID)"),
		cartItemIds: z
			.array(z.number())
			.describe("선택된 장바구니 아이템 ID 목록 (비어있으면 전체 카트 아이템)")
			.optional(),
	}),
	z.object({
		type: z.literal("PRODUCT"),
		paymentId: z.string().min(1, "결제 ID를 입력해주세요").describe("결제 ID (클라이언트에서 생성한 고유 ID)"),
		products: z
			.array(
				z.object({
					productId: z.number().min(1, "상품 ID를 입력해주세요").describe("상품 ID"),
					licenseId: z.number().min(1, "라이센스 ID를 입력해주세요").describe("라이센스 ID"),
				}),
			)
			.min(1, "구매할 상품을 입력해주세요")
			.describe("구매할 상품 목록"),
	}),
]);

export type PaymentOrderCreateRequest = z.infer<typeof PaymentOrderCreateRequestSchema>;
