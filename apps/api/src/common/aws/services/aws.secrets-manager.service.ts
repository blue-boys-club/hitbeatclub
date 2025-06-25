import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { IAwsSecretsManagerService } from "~/common/aws/interfaces/aws.secrets-manager-service.interface";

@Injectable()
export class AwsSecretsManagerService implements IAwsSecretsManagerService {
	private readonly secretsClient: SecretsManagerClient;
	private readonly logger = new Logger(AwsSecretsManagerService.name);
	/**
	 * 간단한 인메모리 캐시. 동일한 시크릿 요청 시 재호출을 줄이기 위해 사용합니다.
	 */
	private readonly cache: Map<string, string> = new Map();

	constructor(private readonly configService: ConfigService) {
		const accessKeyId =
			this.configService.get<string>("aws.secretsManager.credential.key") ??
			this.configService.get<string>("AWS_ACCESS_KEY_ID");
		const secretAccessKey =
			this.configService.get<string>("aws.secretsManager.credential.secret") ??
			this.configService.get<string>("AWS_SECRET_ACCESS_KEY");
		const region =
			this.configService.get<string>("aws.secretsManager.region") ?? this.configService.get<string>("AWS_REGION");

		this.secretsClient = new SecretsManagerClient({
			region,
			...(accessKeyId && secretAccessKey ? { credentials: { accessKeyId, secretAccessKey } } : {}),
		});
	}

	/**
	 * 지정된 SecretId에 해당하는 값을 반환합니다. 응답은 UTF-8 문자열로 변환됩니다.
	 * 동일한 SecretId 요청은 메모리 캐시에 의해 재사용됩니다.
	 */
	async getSecret(secretId: string): Promise<string> {
		if (this.cache.has(secretId)) {
			return this.cache.get(secretId);
		}

		try {
			const command = new GetSecretValueCommand({ SecretId: secretId });
			const response = await this.secretsClient.send(command);

			const value = response.SecretString ?? Buffer.from(response.SecretBinary).toString("utf-8");

			this.cache.set(secretId, value);
			return value;
		} catch (err: any) {
			this.logger.error(`Failed to retrieve secret: ${secretId}`, err?.stack);
			throw err;
		}
	}
}
