import { z } from "zod";

export const FileSingleUploadSchema = z.object({
	type: z
		.enum(["PRODUCT_COVER_IMAGE", "PRODUCT_AUDIO_FILE", "PRODUCT_ZIP_FILE", "ARTIST_PROFILE_IMAGE"])
		.describe("파일 타입"),
});

export type FileSingle = z.infer<typeof FileSingleUploadSchema>;
