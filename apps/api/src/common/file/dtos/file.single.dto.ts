import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export class FileSingleDto {
	@ApiProperty({
		type: "string",
		format: "binary",
		description: "업로드할 파일",
		required: true,
	})
	file: Express.Multer.File;

	@ApiProperty({
		enum: ["PRODUCT_COVER_IMAGE", "PRODUCT_AUDIO_FILE", "PRODUCT_ZIP_FILE"],
		description: "파일 타입",
		example: "PRODUCT_COVER_IMAGE",
		required: true,
	})
	@IsEnum(["PRODUCT_COVER_IMAGE", "PRODUCT_AUDIO_FILE", "PRODUCT_ZIP_FILE"])
	type: "PRODUCT_COVER_IMAGE" | "PRODUCT_AUDIO_FILE" | "PRODUCT_ZIP_FILE";
}
