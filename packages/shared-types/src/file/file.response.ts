import { z } from "zod";

export const FileUploadResponseSchema = z.object({
	id: z.number().describe("파일 ID"),
	url: z.string().describe("파일 URL"),
	originalName: z.string().optional().describe("파일 원본 이름"),
});

export type FileUploadResponse = z.infer<typeof FileUploadResponseSchema>;
