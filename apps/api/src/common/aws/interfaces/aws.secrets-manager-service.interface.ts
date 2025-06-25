export interface IAwsSecretsManagerService {
	/**
	 * Returns the secret value for the given SecretId.
	 * The value is returned as a UTF-8 string and cached in memory for subsequent requests.
	 */
	getSecret(secretId: string): Promise<string>;
}
