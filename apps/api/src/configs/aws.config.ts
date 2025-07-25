import { registerAs } from "@nestjs/config";

export default registerAs(
	"aws",
	(): Record<string, any> => ({
		s3: {
			credential: {
				key: process.env.AWS_S3_CREDENTIAL_KEY,
				secret: process.env.AWS_S3_CREDENTIAL_SECRET,
			},
			bucket: process.env.AWS_S3_BUCKET ?? "bucket",
			region: process.env.AWS_S3_REGION,
			baseUrl: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com`,
		},
		cloudfront: {
			baseUrl:
				process.env.AWS_CLOUDFRONT_DOMAIN ??
				`https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com`,
			enabled: process.env.AWS_CLOUDFRONT_ENABLED === "true" || false,
			distributionDomain: process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN,
			keyPairId: process.env.AWS_CLOUDFRONT_KEY_PAIR_ID,
			privateKey: process.env.AWS_CLOUDFRONT_PRIVATE_KEY,
			privateKeySecretId: process.env.AWS_CLOUDFRONT_PRIVATE_KEY_SECRET_ID,
		},
		secretsManager: {
			credential: {
				key: process.env.AWS_SECRETS_MANAGER_CREDENTIAL_KEY,
				secret: process.env.AWS_SECRETS_MANAGER_CREDENTIAL_SECRET,
			},
			region: process.env.AWS_SECRETS_MANAGER_REGION,
		},
		ses: {
			credential: {
				key: process.env.AWS_SES_CREDENTIAL_KEY,
				secret: process.env.AWS_SES_CREDENTIAL_SECRET,
			},
			region: process.env.AWS_SES_REGION,
		},
	}),
);
