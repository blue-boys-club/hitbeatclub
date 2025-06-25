import { z } from "zod";
import { subscriptionPlanSchema } from "./subscribe.request";

export const SubscribeResponseSchema = z.object({
	id: z.number().describe("구독 ID").default(1),
	userId: z.number().describe("사용자 ID").default(1),
	subscriptionPlan: z.string().describe("구독 플랜").default("MONTH"),
	productType: z.string().describe("상품 유형").default("MEMBERSHIP"),
	price: z.number().describe("가격").default(19900),
	nextPaymentDate: z.date().describe("다음 결제일").default(new Date()),
	createdAt: z.date().describe("생성일").default(new Date()),
	updatedAt: z.date().describe("수정일").default(new Date()),
	deletedAt: z.date().nullable().describe("삭제일").default(null),
});

export type SubscribeResponse = z.infer<typeof SubscribeResponseSchema>;

export const SubscribeMembershipResponseSchema = z.object({
	userId: z.number(),
	subscribedAt: z.date(),
	artistId: z.number(),
});

export type SubscribeMembershipResponse = z.infer<typeof SubscribeMembershipResponseSchema>;

export const SubscribeCreateResponseSchema = z.object({
	userId: z.number().describe("사용자 ID"),
	createdAt: z.date().describe("구독 생성 일시"),
	nextPaymentDate: z.date().nullable().describe("다음 결제일"),
	artistId: z.number().describe("아티스트 ID"),
});

export type SubscribeCreateResponse = z.infer<typeof SubscribeCreateResponseSchema>;

export const SubscribePlansResponseSchema = z.record(
	subscriptionPlanSchema,
	z.object({
		price: z.number().describe("가격"),
		discountPrice: z.number().nullable().describe("할인 가격"),
		discountRate: z.number().nullable().describe("할인율"),
	}),
);

export type SubscribePlansResponse = z.infer<typeof SubscribePlansResponseSchema>;
