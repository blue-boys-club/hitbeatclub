import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class AuthGoogleLoginResponseDto {
	@ApiProperty({
		description: "User id",
		example: "1",
	})
	@IsNumber()
	userId: number;

	@ApiProperty({
		description: "Access token",
		example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	})
	accessToken: string;

	@ApiProperty({
		description: "Refresh token",
		example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	})
	refreshToken: string;

	@ApiProperty({
		description: "User email",
		example: "user@example.com",
	})
	email: string;
}
