import { z } from "zod";

export const TagResponseSchema = z.object({
	id: z.number().describe("태그 ID").default(0),
	name: z.string().describe("태그 이름").default("태그"),
	count: z.number().describe("태그 개수").default(0),
});

export const TagListResponseSchema = z.array(TagResponseSchema);

export type TagResponse = z.infer<typeof TagResponseSchema>;
export type TagListResponse = z.infer<typeof TagListResponseSchema>;
