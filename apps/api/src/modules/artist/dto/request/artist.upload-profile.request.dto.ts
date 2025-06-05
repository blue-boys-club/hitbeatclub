import { ENUM_FILE_TYPE } from "@hitbeatclub/shared-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export class ArtistUploadProfileRequestDto {
	@ApiProperty({
		enum: [ENUM_FILE_TYPE.ARTIST_PROFILE_IMAGE],
		description: "파일 타입",
		example: ENUM_FILE_TYPE.ARTIST_PROFILE_IMAGE,
		required: true,
	})
	@IsEnum([ENUM_FILE_TYPE.ARTIST_PROFILE_IMAGE])
	type: ENUM_FILE_TYPE.ARTIST_PROFILE_IMAGE;

	@ApiProperty({
		type: "string",
		format: "binary",
		description: "업로드할 파일",
		required: true,
	})
	file: Express.Multer.File;
}
