import { z } from "zod";

// 가상계좌 정보 스키마
export const VirtualAccountSchema = z.object({
	bankCode: z.string().describe("은행 코드"),
	bankName: z.string().describe("은행명"),
	accountNumber: z.string().describe("계좌번호"),
	dueDate: z.string().describe("입금 기한"),
});

export type VirtualAccount = z.infer<typeof VirtualAccountSchema>;

// 결제 완료 응답 스키마
export const PaymentCompletionResponseSchema = z.object({
	orderId: z.number().describe("주문 ID"),
	paymentId: z.string().describe("결제 ID"),
	status: z.enum(["COMPLETED", "WAITING_FOR_DEPOSIT", "CANCELLED"]).describe("결제 상태"),
	amount: z.number().describe("결제 금액"),
	paidAt: z.date().describe("결제 완료 시간").optional(),
	paymentMethod: z.string().describe("결제 수단").optional(),
	virtualAccount: VirtualAccountSchema.describe("가상계좌 정보 (가상계좌 결제시)").optional(),
});

export type PaymentCompletionResponse = z.infer<typeof PaymentCompletionResponseSchema>;

// 결제 주문 아이템 스키마
export const PaymentOrderItemSchema = z.object({
	id: z.number().describe("카트 아이템 ID"),
	productId: z.number().describe("상품 ID"),
	productName: z.string().describe("상품명"),
	price: z.number().describe("가격"),
	licenseType: z.string().describe("라이선스 타입"),
	imageUrl: z.string().describe("이미지 URL").optional(),
});

export type PaymentOrderItem = z.infer<typeof PaymentOrderItemSchema>;

// 결제 주문 응답 스키마
export const PaymentOrderResponseSchema = z.object({
	orderId: z.number().describe("주문 내부 ID"),
	orderUuid: z.string().describe("주문 UUID (결제 처리용)"),
	orderNumber: z.string().describe("주문 번호 (외부 노출용, 날짜+시간+랜덤)"),
	paymentId: z.string().describe("결제 ID"),
	orderName: z.string().describe("주문명"),
	totalAmount: z.number().describe("총 금액"),
	items: z.array(PaymentOrderItemSchema).describe("주문 아이템 목록"),
});

export type PaymentOrderResponse = z.infer<typeof PaymentOrderResponseSchema>;
