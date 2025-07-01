import { z } from "zod";

export const ExchangeRateResponseSchema = z.object({
	id: z.string().describe("ID"),
	baseCurrency: z.string().describe("Base currency"),
	targetCurrency: z.string().describe("Target currency"),
	rate: z.number().describe("Exchange rate"),
	createdAt: z.string().datetime().describe("생성 일시"),
});
export type ExchangeRateResponse = z.infer<typeof ExchangeRateResponseSchema>;
