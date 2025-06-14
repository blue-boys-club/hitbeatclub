import z from "zod";

export const PaginationRequestSchema = z.object({
	page: z.string().transform(Number).pipe(z.number().int().optional()).describe("1").optional(),
	limit: z.string().transform(Number).pipe(z.number().int().optional()).describe("10").optional(),
});

export type PaginationRequest = z.infer<typeof PaginationRequestSchema>;
