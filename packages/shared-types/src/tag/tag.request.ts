import { z } from "zod";

export const TagCreateRequestSchema = z.object({
	name: z
		.string()
		.min(1, "태그 이름은 필수입니다.")
		.max(20, "태그 이름은 최대 20자까지 입력할 수 있습니다.")
		.describe("태그 이름")
		.default("tag"),
});

export type TagCreateRequest = z.infer<typeof TagCreateRequestSchema>;
