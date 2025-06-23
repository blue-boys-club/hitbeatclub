import { z } from "zod";

export const PlayerStartRequestSchema = z.object({
	userId: z.coerce.number(),
	productId: z.coerce.number(),
});

export type PlayerStartRequest = z.infer<typeof PlayerStartRequestSchema>;
