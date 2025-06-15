import z from "zod";

export const CartCreateRequestSchema = z.object({
	productId: z.number().int().positive(),
	licenseId: z.number().int().positive(),
});

export type CartCreateRequestDto = z.infer<typeof CartCreateRequestSchema>;
