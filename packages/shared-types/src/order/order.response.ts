import { z } from "zod";

export const OrderResponseSchema = z.object({
	id: z.number().describe("주문 ID").default(1),
	userId: z.number().describe("사용자 ID").default(1),
	productId: z.number().describe("상품 ID").default(1),
	quantity: z.number().describe("수량").default(1),
	totalPrice: z.number().describe("총 가격").default(10000),
	status: z
		.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"])
		.describe("주문 상태")
		.default("pending"),
	shippingAddress: z.string().describe("배송 주소").default("서울시 강남구"),
	phoneNumber: z.string().describe("연락처").default("010-1234-5678"),
	memo: z.string().describe("주문 메모").default("").optional(),
	createdAt: z.string().datetime().describe("주문 생성 시간").default("2024-01-01T00:00:00Z"),
	updatedAt: z.string().datetime().describe("주문 수정 시간").default("2024-01-01T00:00:00Z"),
});

export type OrderResponse = z.infer<typeof OrderResponseSchema>;

export const OrderListResponseSchema = z.object({
	orders: z.array(OrderResponseSchema).describe("주문 목록").default([]),
	total: z.number().describe("전체 주문 수").default(0),
	page: z.number().describe("현재 페이지").default(1),
	limit: z.number().describe("페이지당 항목 수").default(10),
});

export type OrderListResponse = z.infer<typeof OrderListResponseSchema>;
