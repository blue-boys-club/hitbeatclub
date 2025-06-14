import z from "zod";

export const PaginationRequestSchema = z.object({
	page: z.coerce.number().int().optional().describe("1").default(1),
	limit: z.coerce.number().int().optional().describe("10").default(10),
});

export type PaginationRequest = z.infer<typeof PaginationRequestSchema>;
