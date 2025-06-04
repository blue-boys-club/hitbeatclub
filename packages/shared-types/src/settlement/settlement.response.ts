import { z } from "zod";
import { ENUM_SETTLEMENT_BANK } from "./settlement.request";

export const SettlementBankAccountResponseSchema = z.object({
	type: z.literal("BANK_ACCOUNT"),
	accountHolder: z.string().min(1).max(100).describe("입금주 명").default("김민준"),
	accountNumber: z.string().min(1).max(100).describe("계좌번호").default("1231234567890"),
	accountBank: z.enum(ENUM_SETTLEMENT_BANK).describe("은행").default("BANK_OF_KOREA"),
});

export const SettlementPaypalResponseSchema = z.object({
	type: z.literal("PAYPAL"),
	accountHolder: z.string().min(1).max(100).describe("입금주 명").default("김민준"),
	paypalAccount: z.string().email().min(1).max(100).describe("페이팔 계정").default("djcool@gmail.com"),
});

export const SettlementResponseSchema = z.discriminatedUnion("type", [
	SettlementBankAccountResponseSchema,
	SettlementPaypalResponseSchema,
]);

export type SettlementResponse = z.infer<typeof SettlementResponseSchema>;
