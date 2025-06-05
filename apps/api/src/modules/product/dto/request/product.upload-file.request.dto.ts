import { ENUM_FILE_TYPE } from "@hitbeatclub/shared-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export class ProductUploadFileRequestDto {
	@ApiProperty({
		enum: [ENUM_FILE_TYPE.PRODUCT_COVER_IMAGE, ENUM_FILE_TYPE.PRODUCT_AUDIO_FILE, ENUM_FILE_TYPE.PRODUCT_ZIP_FILE],
		description: "파일 타입",
		example: ENUM_FILE_TYPE.PRODUCT_COVER_IMAGE,
		required: true,
	})
	@IsEnum([ENUM_FILE_TYPE.PRODUCT_COVER_IMAGE, ENUM_FILE_TYPE.PRODUCT_AUDIO_FILE, ENUM_FILE_TYPE.PRODUCT_ZIP_FILE])
	type: ENUM_FILE_TYPE.PRODUCT_COVER_IMAGE | ENUM_FILE_TYPE.PRODUCT_AUDIO_FILE | ENUM_FILE_TYPE.PRODUCT_ZIP_FILE;

	@ApiProperty({
		type: "string",
		format: "binary",
		description: "업로드할 파일",
		required: true,
	})
	file: Express.Multer.File;
}
