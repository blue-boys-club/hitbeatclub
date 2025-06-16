import z from "zod";

export const CartCreateRequestSchema = z.object({
	productId: z.number().int().positive(),
	licenseId: z.number().int().positive(),
});

export const CartUpdateRequestSchema = z.object({
	licenseId: z.number().int().positive(),
});

export type CartCreateRequestDto = z.infer<typeof CartCreateRequestSchema>;
export type CartUpdateRequestDto = z.infer<typeof CartUpdateRequestSchema>;
