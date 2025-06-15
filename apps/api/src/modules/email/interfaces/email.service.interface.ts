import { GetEmailTemplateCommandOutput } from "@aws-sdk/client-sesv2";

export interface IEmailService {
	createChangePassword(): Promise<boolean>;
	getChangePassword(): Promise<GetEmailTemplateCommandOutput>;
	deleteChangePassword(): Promise<boolean>;
	sendChangePassword(to: string, token: string): Promise<boolean>;
	createSignUp(): Promise<boolean>;
	getSignUp(): Promise<GetEmailTemplateCommandOutput>;
	deleteSignUp(): Promise<boolean>;
	sendSignUp(to: string, token: string): Promise<boolean>;
	initializeTemplates(): Promise<void>;
}
