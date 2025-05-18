import { z } from "zod";

export enum RecurringPeriod {
	MONTHLY = "monthly",
	YEARLY = "yearly",
}

// 신용카드 정보 스키마
export const cardCredentialSchema = z.object({
	number: z.string().min(15, "카드 번호를 입력해주세요.").max(19, "올바른 카드 번호를 입력해주세요."),
	expiryMonth: z
		.string()
		.min(2, "만료월을 입력해주세요.")
		.max(2, "만료월을 2자리로 입력해주세요.")
		.regex(/^(0[1-9]|1[0-2])$/, "01~12 사이의 값을 입력해주세요."),
	expiryYear: z
		.string()
		.min(2, "만료년도를 입력해주세요.")
		.max(2, "만료년도를 2자리로 입력해주세요.")
		.regex(/^[0-9]{2}$/, "유효한 년도를 입력해주세요."),
	birthOrBusinessRegistrationNumber: z
		.string()
		.min(6, "생년월일을 입력해주세요.")
		.max(10, "올바른 생년월일 또는 사업자등록번호를 입력해주세요."),
	passwordTwoDigits: z
		.string()
		.min(2, "비밀번호 앞 2자리를 입력해주세요.")
		.max(2, "비밀번호 앞 2자리를 입력해주세요.")
		.regex(/^[0-9]{2}$/, "숫자 2자리를 입력해주세요."),
});

// 페이팔 정보 스키마
export const paypalCredentialSchema = z.object({
	billingKey: z.string().min(1, "페이팔 빌링키를 입력해주세요."),
});

export type CardCredential = z.infer<typeof cardCredentialSchema>;

// 결제 방식 스키마
export const paymentMethodSchema = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("CARD"),
		billingKey: z.string().min(1, "카드 빌링키를 입력해주세요."),
	}),
	z.object({
		type: z.literal("TOSS"),
		billingKey: z.string().min(1, "토스 빌링키를 입력해주세요."),
	}),
	z.object({
		type: z.literal("PAYPAL"),
		billingKey: z.string().min(1, "페이팔 빌링키를 입력해주세요."),
	}),
]);

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

// 구독 폼 스키마 정의
export const subscribeFormSchema = z.object({
	recurringPeriod: z.nativeEnum(RecurringPeriod),
	promotionCode: z.string().optional(),
	method: paymentMethodSchema.optional(),
});

// 타입 추출
export type SubscribeFormValues = z.infer<typeof subscribeFormSchema>;

// 프로모션 코드 검증 스키마
export const promotionCodeSchema = z.object({
	code: z.string().min(1, "프로모션 코드를 입력해주세요."),
});

export type PromotionCodeValues = z.infer<typeof promotionCodeSchema>;
