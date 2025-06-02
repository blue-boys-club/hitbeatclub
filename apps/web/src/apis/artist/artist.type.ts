import { z } from "zod";
import { FileSingleArtistUploadSchema, ENUM_FILE_TYPE } from "@hitbeatclub/shared-types/file";

export const ArtistUploadProfileSchema = FileSingleArtistUploadSchema.extend({
	type: z.literal(ENUM_FILE_TYPE.ARTIST_PROFILE_IMAGE),
	file: z.instanceof(File),
});

export type ArtistUploadProfileRequest = z.infer<typeof ArtistUploadProfileSchema>;
