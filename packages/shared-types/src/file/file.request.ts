import { z } from "zod";

// enum
export enum ENUM_FILE_TYPE {
	PRODUCT_COVER_IMAGE = "PRODUCT_COVER_IMAGE",
	PRODUCT_AUDIO_FILE = "PRODUCT_AUDIO_FILE",
	PRODUCT_ZIP_FILE = "PRODUCT_ZIP_FILE",
	ARTIST_PROFILE_IMAGE = "ARTIST_PROFILE_IMAGE",
}

export const FileSingleProductUploadSchema = z.object({
	type: z
		.enum([ENUM_FILE_TYPE.PRODUCT_COVER_IMAGE, ENUM_FILE_TYPE.PRODUCT_AUDIO_FILE, ENUM_FILE_TYPE.PRODUCT_ZIP_FILE])
		.describe("파일 타입"),
});

export const FileSingleArtistUploadSchema = z.object({
	type: z.enum([ENUM_FILE_TYPE.ARTIST_PROFILE_IMAGE]).describe("파일 타입"),
});

export const FileSingleUploadSchema = z.union([FileSingleProductUploadSchema, FileSingleArtistUploadSchema]);

export type FileSingle = z.infer<typeof FileSingleUploadSchema>;
