export interface IAwsCloudfrontService {
	/**
	 * CloudFront 서명된 URL을 생성합니다
	 */
	createSignedUrl(url: string, expiresInSeconds?: number): Promise<string>;

	/**
	 * 여러 CloudFront 서명된 URL을 일괄 생성합니다
	 */
	createMultipleSignedUrls(urls: string[], expiresInSeconds?: number): Promise<string[]>;

	/**
	 * 서명된 쿠키를 생성합니다
	 */
	createSignedCookie(
		resource: string,
		expiresInSeconds?: number,
	): Promise<{
		"CloudFront-Policy": string;
		"CloudFront-Signature": string;
		"CloudFront-Key-Pair-Id": string;
	}>;

	/**
	 * URL이 CloudFront 도메인인지 확인합니다
	 */
	isCloudFrontUrl(url: string): boolean;

	/**
	 * S3 또는 CloudFront URL을 생성합니다
	 */
	generateFileUrl(key: string): string;

	/**
	 * 기존 S3 URL을 CloudFront URL로 변환합니다
	 */
	convertS3UrlToCloudFrontUrl(s3Url: string): Promise<string>;

	/**
	 * 여러 S3 URL을 CloudFront URL로 일괄 변환합니다
	 */
	convertMultipleS3UrlsToCloudFrontUrls(s3Urls: string[]): Promise<string[]>;

	/**
	 * CloudFront가 활성화되어 있는지 확인합니다
	 */
	isCloudFrontEnabled(): boolean;

	/**
	 * CloudFront 기본 URL을 반환합니다
	 */
	getCloudFrontBaseUrl(): string;
}
