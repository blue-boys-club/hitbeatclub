import { ENUM_FILE_TYPE } from "@hitbeatclub/shared-types";
import { IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class NoticeUploadFileRequestDto {
	@ApiProperty({
		enum: [ENUM_FILE_TYPE.NOTICE_FILE],
		description: "파일 타입",
		example: ENUM_FILE_TYPE.NOTICE_FILE,
		required: true,
	})
	@IsEnum([ENUM_FILE_TYPE.NOTICE_FILE])
	type: ENUM_FILE_TYPE.NOTICE_FILE;

	@ApiProperty({
		type: "string",
		format: "binary",
		description: "업로드할 파일",
		required: true,
	})
	file: Express.Multer.File;
}
