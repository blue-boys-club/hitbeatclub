import { Injectable, Logger } from "@nestjs/common";
import { AwsSESService } from "src/common/aws/services/aws.ses.service";
import { ConfigService } from "@nestjs/config";
import { IEmailService } from "src/modules/email/interfaces/email.service.interface";
import { readFileSync } from "fs";
import { GetEmailTemplateCommandOutput } from "@aws-sdk/client-sesv2";
import { IAuthHash } from "src/modules/auth/interfaces/auth.interface";
import path from "path";

@Injectable()
export class EmailService implements IEmailService {
	private readonly logger = new Logger(EmailService.name);
	private readonly fromEmail: string;
	private readonly domain: string;
	private readonly appEnv: string;

	constructor(
		private readonly awsSESService: AwsSESService,
		private readonly configService: ConfigService,
	) {
		this.fromEmail = this.configService.get<string>("email.fromEmail");
		this.domain = this.configService.get<string>("email.domain");
		this.appEnv = this.configService.get<string>("app.env");
	}

	/**
	 * 환경별 템플릿 이름 생성
	 */
	private getTemplateName(baseTemplateName: string): string {
		return `${this.appEnv}-${baseTemplateName}`;
	}

	/**
	 * 템플릿 존재 여부 확인
	 */
	private async templateExists(templateName: string): Promise<boolean> {
		try {
			await this.awsSESService.getTemplate({ name: templateName });
			return true;
		} catch (err: any) {
			if (err.name === "TemplateDoesNotExistException" || err.Code === "TemplateDoesNotExist") {
				return false;
			}
			throw err;
		}
	}

	/**
	 * 템플릿을 생성하거나 업데이트합니다
	 */
	private async createOrUpdateTemplate(templateName: string, subject: string, htmlBody: string): Promise<void> {
		const exists = await this.templateExists(templateName);

		if (exists) {
			this.logger.log(`Template ${templateName} exists, updating...`);
			await this.awsSESService.updateTemplate({
				name: templateName,
				subject,
				htmlBody,
			});
			this.logger.log(`Template ${templateName} updated successfully`);
		} else {
			this.logger.log(`Template ${templateName} does not exist, creating...`);
			await this.awsSESService.createTemplate({
				name: templateName,
				subject,
				htmlBody,
			});
			this.logger.log(`Template ${templateName} created successfully`);
		}
	}

	/** 탬플릿 절대 경로 반환 */
	private getTemplatePath(templateName: string): string {
		return path.join(__dirname, "..", "templates", `${templateName}.template.html`);
	}

	async createChangePassword(): Promise<boolean> {
		try {
			const templateName = this.getTemplateName("CHANGE_PASSWORD");
			await this.createOrUpdateTemplate(
				templateName,
				`[히트비트클럽] 비밀번호를 변경하시겠습니까?`,
				readFileSync(this.getTemplatePath("email.change-password"), "utf8"),
			);
			return true;
		} catch (err: unknown) {
			this.logger.error(err, `Failed to create/update template CHANGE_PASSWORD`);
			return false;
		}
	}

	async getChangePassword(): Promise<GetEmailTemplateCommandOutput> {
		try {
			const templateName = this.getTemplateName("CHANGE_PASSWORD");
			const template = await this.awsSESService.getTemplate({
				name: templateName,
			});

			return template;
		} catch (err: unknown) {
			this.logger.error(`Failed to get template CHANGE_PASSWORD:`, err);
			return;
		}
	}

	async deleteChangePassword(): Promise<boolean> {
		try {
			const templateName = this.getTemplateName("CHANGE_PASSWORD");
			await this.awsSESService.deleteTemplate({
				name: templateName,
			});

			this.logger.log(`Template ${templateName} deleted successfully`);
			return true;
		} catch (err: unknown) {
			this.logger.error(`Failed to delete template CHANGE_PASSWORD:`, err);
			return false;
		}
	}

	async sendChangePassword(to: string, token: string): Promise<boolean> {
		try {
			const templateName = this.getTemplateName("CHANGE_PASSWORD");
			// 템플릿을 사용하여 이메일 발송
			await this.awsSESService.send({
				recipients: [to],
				sender: this.fromEmail,
				templateName: templateName,
				templateData: {
					domain: this.domain,
					token: token,
					email: to,
				},
			});

			this.logger.log(`Change password email sent successfully to ${to}`);
			return true;
		} catch (err: unknown) {
			this.logger.error(`Failed to send change password email to ${to}:`, err);
			return false;
		}
	}

	async createSignUp(): Promise<boolean> {
		try {
			const templateName = this.getTemplateName("SIGN_UP");
			await this.createOrUpdateTemplate(
				templateName,
				`[히트비트클럽] 회원 가입을 환영합니다.`,
				readFileSync(this.getTemplatePath("email.sign-up"), "utf8"),
			);
			return true;
		} catch (err: unknown) {
			this.logger.error(`Failed to create/update template SIGN_UP:`, err);
			return false;
		}
	}

	async getSignUp(): Promise<GetEmailTemplateCommandOutput> {
		try {
			const templateName = this.getTemplateName("SIGN_UP");
			const template = await this.awsSESService.getTemplate({
				name: templateName,
			});

			return template;
		} catch (err: unknown) {
			this.logger.error(`Failed to get template SIGN_UP:`, err);
			return;
		}
	}

	async deleteSignUp(): Promise<boolean> {
		try {
			const templateName = this.getTemplateName("SIGN_UP");
			await this.awsSESService.deleteTemplate({
				name: templateName,
			});

			this.logger.log(`Template ${templateName} deleted successfully`);
			return true;
		} catch (err: unknown) {
			this.logger.error(`Failed to delete template SIGN_UP:`, err);
			return false;
		}
	}

	async sendSignUp(to: string, token: string): Promise<boolean> {
		try {
			const templateName = this.getTemplateName("SIGN_UP");
			// 템플릿을 사용하여 이메일 발송
			await this.awsSESService.send({
				recipients: [to],
				sender: this.fromEmail,
				templateName: templateName,
				templateData: {
					domain: this.domain,
					token: token,
					email: to,
				},
			});

			this.logger.log(`Sign up email sent successfully to ${to}`);
			return true;
		} catch (err: unknown) {
			this.logger.error(`Failed to send sign up email to ${to}:`, err);
			return false;
		}
	}

	/**
	 * 모든 이메일 템플릿을 초기화합니다.
	 * 애플리케이션 시작 시 또는 필요에 따라 호출하세요.
	 */
	async initializeTemplates(): Promise<void> {
		this.logger.log(`Initializing email templates for environment: ${this.appEnv}`);

		const templates = [
			{ name: "Change Password", createFn: () => this.createChangePassword() },
			{ name: "Sign Up", createFn: () => this.createSignUp() },
		];

		for (const template of templates) {
			try {
				await template.createFn();
				this.logger.log(`${template.name} template initialized for ${this.appEnv}`);
			} catch (error) {
				this.logger.warn(`Failed to initialize ${template.name} template:`, error);
			}
		}
	}
}
