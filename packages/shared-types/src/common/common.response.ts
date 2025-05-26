import { z } from "zod";

export const CommonResponseSchema = z.object({
	statusCode: z.number(),
	message: z.string(),
});

export const CommonResponseIdSchema = CommonResponseSchema.extend({
	data: z.object({
		id: z.number(),
	}),
});

export type CommonResponseId = z.infer<typeof CommonResponseIdSchema>;
export type CommonResponse = z.infer<typeof CommonResponseSchema>;
