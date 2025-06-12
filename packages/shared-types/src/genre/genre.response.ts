import { z } from "zod";

export const GenreWithCountResponseSchema = z.object({
	id: z.number().describe("장르 ID").default(0),
	name: z.string().describe("장르 이름").default("장르"),
	count: z.number().describe("장르 개수").default(0),
});

export const GenreListResponseSchema = z.array(GenreWithCountResponseSchema);

export type GenreWithCountResponse = z.infer<typeof GenreWithCountResponseSchema>;
