import { z } from "zod";

export const TagResponseSchema = z.object({
	id: z.number(),
	name: z.string(),
});

export const TagListResponseSchema = z.array(TagResponseSchema);

export type TagResponse = z.infer<typeof TagResponseSchema>;
export type TagListResponse = z.infer<typeof TagListResponseSchema>;
