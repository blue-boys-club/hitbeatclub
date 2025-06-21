import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import * as crypto from "crypto";
import { IAwsCloudfrontService } from "~/common/aws/interfaces/aws.cloudfront-service.interface";
import { ENUM_AWS_STATUS_CODE_ERROR } from "~/common/aws/constants/aws.status-code.constant";

@Injectable()
export class AwsCloudfrontService implements IAwsCloudfrontService {
	private readonly distributionDomain: string;
	private readonly keyPairId: string;
	private readonly privateKey: string;
	private readonly cloudfrontBaseUrl: string;
	private readonly cloudfrontEnabled: boolean;
	private readonly s3BaseUrl: string;
	private readonly defaultExpiresInSeconds: number = 3600; // 1시간

	constructor(private readonly configService: ConfigService) {
		this.distributionDomain = this.configService.get<string>("aws.cloudfront.distributionDomain");
		this.keyPairId = this.configService.get<string>("aws.cloudfront.keyPairId");
		this.privateKey = this.configService.get<string>("aws.cloudfront.privateKey");
		this.cloudfrontBaseUrl = this.configService.get<string>("aws.cloudfront.baseUrl");
		this.cloudfrontEnabled = this.configService.get<boolean>("aws.cloudfront.enabled");
		this.s3BaseUrl = this.configService.get<string>("aws.s3.baseUrl");
	}

	/**
	 * CloudFront 서명된 URL을 생성합니다
	 * @param url 서명할 URL
	 * @param expiresInSeconds 만료 시간 (초, 기본값: 3600초)
	 * @returns 서명된 URL
	 */
	async createSignedUrl(url: string, expiresInSeconds: number = this.defaultExpiresInSeconds): Promise<string> {
		try {
			if (!this.isCloudFrontUrl(url)) {
				throw new BadRequestException({
					statusCode: ENUM_AWS_STATUS_CODE_ERROR.CLOUDFRONT_INVALID_URL_ERROR,
					message: "aws.error.cloudfront.invalidUrl",
				});
			}

			const dateLessThan = new Date(Date.now() + expiresInSeconds * 1000);

			const signedUrl = getSignedUrl({
				url,
				dateLessThan: dateLessThan.toISOString(),
				keyPairId: this.keyPairId,
				privateKey: this.privateKey,
			});

			return Promise.resolve(signedUrl);
		} catch (err: any) {
			throw new BadRequestException({
				statusCode: ENUM_AWS_STATUS_CODE_ERROR.CLOUDFRONT_SIGN_URL_ERROR,
				message: `CloudFront sign URL error: ${err.message}`,
			});
		}
	}

	/**
	 * 여러 CloudFront 서명된 URL을 일괄 생성합니다
	 * @param urls 서명할 URL 배열
	 * @param expiresInSeconds 만료 시간 (초, 기본값: 3600초)
	 * @returns 서명된 URL 배열
	 */
	async createMultipleSignedUrls(
		urls: string[],
		expiresInSeconds: number = this.defaultExpiresInSeconds,
	): Promise<string[]> {
		try {
			const signedUrls = await Promise.all(urls.map((url) => this.createSignedUrl(url, expiresInSeconds)));
			return signedUrls;
		} catch (err: any) {
			throw new BadRequestException({
				statusCode: ENUM_AWS_STATUS_CODE_ERROR.CLOUDFRONT_SIGN_URL_ERROR,
				message: `CloudFront multiple sign URL error: ${err.message}`,
			});
		}
	}

	/**
	 * 서명된 쿠키를 생성합니다
	 * @param resource 리소스 경로 또는 패턴
	 * @param expiresInSeconds 만료 시간 (초, 기본값: 3600초)
	 * @returns 서명된 쿠키 객체
	 */
	async createSignedCookie(
		resource: string,
		expiresInSeconds: number = this.defaultExpiresInSeconds,
	): Promise<{
		"CloudFront-Policy": string;
		"CloudFront-Signature": string;
		"CloudFront-Key-Pair-Id": string;
	}> {
		try {
			const dateLessThan = new Date(Date.now() + expiresInSeconds * 1000);

			// 정책 문서 생성
			const policy = {
				Statement: [
					{
						Resource: resource,
						Condition: {
							DateLessThan: {
								"AWS:EpochTime": Math.floor(dateLessThan.getTime() / 1000),
							},
						},
					},
				],
			};

			const policyString = JSON.stringify(policy);
			const policyBase64 = Buffer.from(policyString)
				.toString("base64")
				.replace(/\+/g, "-")
				.replace(/\//g, "_")
				.replace(/=/g, "");

			// 서명 생성 (실제 구현에서는 RSA-SHA1 서명이 필요)
			const sign = crypto.createSign("RSA-SHA1");
			sign.update(policyString);
			const signature = sign.sign(this.privateKey, "base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

			return Promise.resolve({
				"CloudFront-Policy": policyBase64,
				"CloudFront-Signature": signature,
				"CloudFront-Key-Pair-Id": this.keyPairId,
			});
		} catch (err: any) {
			throw new BadRequestException({
				statusCode: ENUM_AWS_STATUS_CODE_ERROR.CLOUDFRONT_SIGN_COOKIE_ERROR,
				message: `CloudFront sign cookie error: ${err.message}`,
			});
		}
	}

	/**
	 * URL이 CloudFront 도메인인지 확인합니다
	 * @param url 확인할 URL
	 * @returns CloudFront URL 여부
	 */
	isCloudFrontUrl(url: string): boolean {
		try {
			const urlObj = new URL(url);
			return urlObj.hostname === this.distributionDomain || urlObj.hostname.endsWith(".cloudfront.net");
		} catch {
			return false;
		}
	}

	/**
	 * CloudFront 배포 도메인을 반환합니다
	 */
	getDistributionDomain(): string {
		return this.distributionDomain;
	}

	/**
	 * 기본 만료 시간을 반환합니다
	 */
	getDefaultExpiresInSeconds(): number {
		return this.defaultExpiresInSeconds;
	}

	/**
	 * S3 또는 CloudFront URL을 생성합니다
	 * CloudFront가 활성화된 경우 CloudFront URL을 반환하고, 그렇지 않으면 S3 URL을 반환합니다
	 */
	generateFileUrl(key: string): string {
		return this.cloudfrontEnabled ? `${this.cloudfrontBaseUrl}/${key}` : `${this.s3BaseUrl}/${key}`;
	}

	/**
	 * 기존 S3 URL을 CloudFront URL로 변환합니다
	 * @param s3Url 기존 S3 URL
	 * @returns CloudFront URL 또는 원본 URL (CloudFront가 비활성화된 경우)
	 */
	async convertS3UrlToCloudFrontUrl(s3Url: string): Promise<string> {
		if (!this.cloudfrontEnabled) {
			return s3Url;
		}

		// S3 URL에서 key 추출
		const key = s3Url.replace(`${this.s3BaseUrl}/`, "");
		return this.generateFileUrl(key);
	}

	/**
	 * 여러 S3 URL을 CloudFront URL로 일괄 변환합니다
	 * @param s3Urls S3 URL 배열
	 * @returns CloudFront URL 배열
	 */
	async convertMultipleS3UrlsToCloudFrontUrls(s3Urls: string[]): Promise<string[]> {
		return Promise.all(s3Urls.map((url) => this.convertS3UrlToCloudFrontUrl(url)));
	}

	/**
	 * CloudFront가 활성화되어 있는지 확인합니다
	 */
	isCloudFrontEnabled(): boolean {
		return this.cloudfrontEnabled;
	}

	/**
	 * CloudFront 기본 URL을 반환합니다
	 */
	getCloudFrontBaseUrl(): string {
		return this.cloudfrontBaseUrl;
	}
}
