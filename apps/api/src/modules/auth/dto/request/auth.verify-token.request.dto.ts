import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsNotEmpty, IsEnum } from "class-validator";
import { TokenPurpose } from "@prisma/client";

export class AuthVerifyTokenRequestDto {
	@ApiProperty({
		description: "검증할 토큰",
		example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
	})
	@IsString()
	@IsNotEmpty()
	token: string;

	@ApiProperty({
		description: "사용자 이메일",
		example: "user@example.com",
	})
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({
		description: "토큰 목적",
		enum: TokenPurpose,
		example: TokenPurpose.PASSWORD_RESET,
	})
	@IsEnum(TokenPurpose)
	@IsNotEmpty()
	purpose: TokenPurpose;
}

export class AuthVerifyPasswordResetTokenRequestDto {
	@ApiProperty({
		description: "비밀번호 재설정 토큰",
		example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
	})
	@IsString()
	@IsNotEmpty()
	token: string;

	@ApiProperty({
		description: "사용자 이메일",
		example: "user@example.com",
	})
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({
		description: "새로운 비밀번호",
		example: "newPassword123!",
	})
	@IsString()
	@IsNotEmpty()
	newPassword: string;
}

export class AuthVerifyEmailRequestDto {
	@ApiProperty({
		description: "이메일 인증 토큰",
		example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
	})
	@IsString()
	@IsNotEmpty()
	token: string;

	@ApiProperty({
		description: "사용자 이메일",
		example: "user@example.com",
	})
	@IsEmail()
	@IsNotEmpty()
	email: string;
}
