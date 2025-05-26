import { z } from "zod";

export const FileUploadResponseSchema = z.object({
	id: z.number().describe("파일 ID"),
	url: z.string().describe("파일 URL"),
});

export type FileUploadResponse = z.infer<typeof FileUploadResponseSchema>;
