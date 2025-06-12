import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ENUM_APP_ENVIRONMENT, ENUM_APP_TIMEZONE } from "src/app/constants/app.enum.constant";

export class AppEnvDto {
	@IsString()
	@IsNotEmpty()
	APP_NAME: string;

	@IsString()
	@IsNotEmpty()
	@IsEnum(ENUM_APP_ENVIRONMENT)
	APP_ENV: ENUM_APP_ENVIRONMENT;

	@IsString()
	@IsNotEmpty()
	@IsEnum(ENUM_APP_TIMEZONE)
	APP_TIMEZONE: ENUM_APP_TIMEZONE;

	@IsBoolean()
	@IsNotEmpty()
	@Type(() => Boolean)
	APP_DEBUG: boolean;

	@IsBoolean()
	@IsNotEmpty()
	@Type(() => Boolean)
	URL_VERSIONING_ENABLE: boolean;

	@IsNumber()
	@IsNotEmpty()
	@Type(() => Number)
	URL_VERSION: number;

	@IsBoolean()
	@IsNotEmpty()
	@Type(() => Boolean)
	JOB_ENABLE: boolean;

	@IsNotEmpty()
	@IsString()
	DATABASE_HOST: string;

	@IsNumber()
	@IsNotEmpty()
	@Type(() => Number)
	DATABASE_PORT: number;

	@IsNotEmpty()
	@IsString()
	AUTH_JWT_SUBJECT: string;

	@IsNotEmpty()
	@IsString()
	AUTH_JWT_AUDIENCE: string;

	@IsNotEmpty()
	@IsString()
	AUTH_JWT_ISSUER: string;

	@IsNotEmpty()
	@IsString()
	AUTH_JWT_ACCESS_TOKEN_EXPIRED: string;

	@IsNotEmpty()
	@IsString()
	AUTH_JWT_ACCESS_TOKEN_SECRET_KEY: string;

	@IsNotEmpty()
	@IsString()
	AUTH_JWT_REFRESH_TOKEN_EXPIRED: string;

	@IsNotEmpty()
	@IsString()
	AUTH_JWT_REFRESH_TOKEN_SECRET_KEY: string;

	@IsOptional()
	@IsString()
	AWS_S3_CREDENTIAL_KEY?: string;

	@IsOptional()
	@IsString()
	AWS_S3_CREDENTIAL_SECRET?: string;

	@IsOptional()
	@IsString()
	AWS_S3_REGION?: string;

	@IsOptional()
	@IsString()
	AWS_S3_BUCKET?: string;

	@IsOptional()
	@IsString()
	AWS_CLOUDFRONT_DOMAIN?: string;

	@IsOptional()
	@IsString()
	AWS_CLOUDFRONT_ENABLED?: string;
}
