import { z } from "zod";

export const OrderCreateRequestSchema = z.object({
	productId: z.number().describe("상품 ID").default(1),
	quantity: z.number().min(1).describe("수량").default(1),
	shippingAddress: z.string().min(1).describe("배송 주소").default("서울시 강남구"),
	phoneNumber: z.string().describe("연락처").default("010-1234-5678"),
	memo: z.string().describe("주문 메모").default("").optional(),
});

export type OrderCreateRequest = z.infer<typeof OrderCreateRequestSchema>;

export const OrderUpdateRequestSchema = z.object({
	status: z
		.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"])
		.describe("주문 상태")
		.default("pending"),
	shippingAddress: z.string().describe("배송 주소").optional(),
	phoneNumber: z.string().describe("연락처").optional(),
	memo: z.string().describe("주문 메모").optional(),
});

export type OrderUpdateRequest = z.infer<typeof OrderUpdateRequestSchema>;
