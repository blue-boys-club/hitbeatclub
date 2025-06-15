import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateAccessTokenDto {
	@IsString()
	@ApiProperty({
		description: "이메일",
		example: "test@test.com",
	})
	email: string;
}
