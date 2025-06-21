import { IsString, IsOptional, IsNumber, Min, Max } from "class-validator";
import { Type } from "class-transformer";

export class AwsCloudfrontSignedUrlDto {
	@IsString()
	url: string;

	@IsOptional()
	@IsNumber()
	@Min(1)
	@Max(604800) // 최대 7일
	@Type(() => Number)
	expiresInSeconds?: number;
}

export class AwsCloudfrontMultipleSignedUrlDto {
	@IsString({ each: true })
	urls: string[];

	@IsOptional()
	@IsNumber()
	@Min(1)
	@Max(604800) // 최대 7일
	@Type(() => Number)
	expiresInSeconds?: number;
}

export class AwsCloudfrontSignedCookieDto {
	@IsString()
	resource: string;

	@IsOptional()
	@IsNumber()
	@Min(1)
	@Max(604800) // 최대 7일
	@Type(() => Number)
	expiresInSeconds?: number;
}

export class AwsCloudfrontSignedUrlResponseDto {
	signedUrl: string;
	expiresAt: Date;
}

export class AwsCloudfrontMultipleSignedUrlResponseDto {
	signedUrls: string[];
	expiresAt: Date;
}

export class AwsCloudfrontSignedCookieResponseDto {
	"CloudFront-Policy": string;
	"CloudFront-Signature": string;
	"CloudFront-Key-Pair-Id": string;
	expiresAt: Date;
}
