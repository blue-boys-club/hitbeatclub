import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
	SESv2Client,
	SendEmailCommand,
	SendBulkEmailCommand,
	CreateEmailTemplateCommand,
	UpdateEmailTemplateCommand,
	DeleteEmailTemplateCommand,
	GetEmailTemplateCommand,
	ListEmailTemplatesCommand,
	CreateEmailTemplateCommandInput,
	CreateEmailTemplateCommandOutput,
	UpdateEmailTemplateCommandInput,
	UpdateEmailTemplateCommandOutput,
	DeleteEmailTemplateCommandInput,
	DeleteEmailTemplateCommandOutput,
	GetEmailTemplateCommandInput,
	GetEmailTemplateCommandOutput,
	ListEmailTemplatesCommandInput,
	ListEmailTemplatesCommandOutput,
	SendEmailCommandInput,
	SendEmailCommandOutput,
	SendBulkEmailCommandInput,
	SendBulkEmailCommandOutput,
} from "@aws-sdk/client-sesv2";
import {
	AwsSESCreateTemplateDto,
	AwsSESGetTemplateDto,
	AwsSESSendBulkDto,
	AwsSESSendDto,
	AwsSESUpdateTemplateDto,
} from "~/common/aws/dtos/aws.ses.dto";
import { IAwsSESService } from "~/common/aws/interfaces/aws.ses-service.interface";

@Injectable()
export class AwsSESService implements IAwsSESService {
	private readonly sesClient: SESv2Client;
	private readonly logger = new Logger(AwsSESService.name);

	constructor(private readonly configService: ConfigService) {
		this.sesClient = new SESv2Client({
			credentials: {
				accessKeyId:
					this.configService.get<string>("aws.ses.credential.key") ?? this.configService.get("AWS_ACCESS_KEY_ID"),
				secretAccessKey:
					this.configService.get<string>("aws.ses.credential.secret") ??
					this.configService.get("AWS_SECRET_ACCESS_KEY"),
			},
			region: this.configService.get<string>("aws.ses.region") ?? this.configService.get("AWS_REGION"),
		});
	}

	async listTemplates(nextToken?: string): Promise<ListEmailTemplatesCommandOutput> {
		const command: ListEmailTemplatesCommand = new ListEmailTemplatesCommand({
			PageSize: 20,
			NextToken: nextToken,
		});

		try {
			const listTemplate: ListEmailTemplatesCommandOutput = await this.sesClient.send<
				ListEmailTemplatesCommandInput,
				ListEmailTemplatesCommandOutput
			>(command);
			return listTemplate;
		} catch (err: any) {
			this.logger.error(err);
			throw err;
		}
	}

	async getTemplate({ name }: AwsSESGetTemplateDto): Promise<GetEmailTemplateCommandOutput> {
		const command: GetEmailTemplateCommand = new GetEmailTemplateCommand({
			TemplateName: name,
		});

		try {
			const getTemplate: GetEmailTemplateCommandOutput = await this.sesClient.send<
				GetEmailTemplateCommandInput,
				GetEmailTemplateCommandOutput
			>(command);

			return getTemplate;
		} catch (err: any) {
			this.logger.error(err);
			throw err;
		}
	}

	async createTemplate({
		name,
		subject,
		htmlBody,
		plainTextBody,
	}: AwsSESCreateTemplateDto): Promise<CreateEmailTemplateCommandOutput> {
		if (!htmlBody && !plainTextBody) {
			throw new Error("body is null");
		}

		const command: CreateEmailTemplateCommand = new CreateEmailTemplateCommand({
			TemplateName: name,
			TemplateContent: {
				Subject: subject,
				Html: htmlBody,
				Text: plainTextBody,
			},
		});

		try {
			const create: CreateEmailTemplateCommandOutput = await this.sesClient.send<
				CreateEmailTemplateCommandInput,
				CreateEmailTemplateCommandOutput
			>(command);

			return create;
		} catch (err: any) {
			this.logger.error(err);
			throw err;
		}
	}

	async updateTemplate({
		name,
		subject,
		htmlBody,
		plainTextBody,
	}: AwsSESUpdateTemplateDto): Promise<UpdateEmailTemplateCommandOutput> {
		if (!htmlBody && !plainTextBody) {
			throw new Error("body is null");
		}

		const command: UpdateEmailTemplateCommand = new UpdateEmailTemplateCommand({
			TemplateName: name,
			TemplateContent: {
				Subject: subject,
				Html: htmlBody,
				Text: plainTextBody,
			},
		});

		try {
			const update: UpdateEmailTemplateCommandOutput = await this.sesClient.send<
				UpdateEmailTemplateCommandInput,
				UpdateEmailTemplateCommandOutput
			>(command);

			return update;
		} catch (err: any) {
			this.logger.error(err);
			throw err;
		}
	}

	async deleteTemplate({ name }: AwsSESGetTemplateDto): Promise<DeleteEmailTemplateCommandOutput> {
		const command: DeleteEmailTemplateCommand = new DeleteEmailTemplateCommand({
			TemplateName: name,
		});

		try {
			const del: DeleteEmailTemplateCommandOutput = await this.sesClient.send<
				DeleteEmailTemplateCommandInput,
				DeleteEmailTemplateCommandOutput
			>(command);

			return del;
		} catch (err: any) {
			this.logger.error(err);
			throw err;
		}
	}

	async sendEmail<T>({
		subject,
		recipients,
		sender,
		replyTo,
		bcc,
		cc,
		htmlBody,
		textBody,
	}: AwsSESSendDto<T>): Promise<SendEmailCommandOutput> {
		const command = new SendEmailCommand({
			FromEmailAddress: sender,
			Destination: {
				ToAddresses: recipients,
				BccAddresses: bcc ?? [],
				CcAddresses: cc ?? [],
			},
			Content: {
				Simple: {
					Subject: {
						Data: subject,
						Charset: "UTF-8",
					},
					Body: {
						Html: htmlBody
							? {
									Data: htmlBody,
									Charset: "UTF-8",
								}
							: undefined,
						Text: textBody
							? {
									Data: textBody,
									Charset: "UTF-8",
								}
							: undefined,
					},
				},
			},
			ReplyToAddresses: replyTo ? [replyTo] : undefined,
		});

		try {
			const result = await this.sesClient.send(command);
			return result;
		} catch (error) {
			this.logger.error(error);
			throw error;
		}
	}

	async send<T>({
		recipients,
		sender,
		replyTo,
		bcc,
		cc,
		templateName,
		templateData,
	}: AwsSESSendDto<T>): Promise<SendEmailCommandOutput> {
		const command: SendEmailCommand = new SendEmailCommand({
			FromEmailAddress: sender,
			Destination: {
				ToAddresses: recipients,
				BccAddresses: bcc ?? [],
				CcAddresses: cc ?? [],
			},
			Content: {
				Template: {
					TemplateName: templateName,
					TemplateData: JSON.stringify(templateData ?? {}),
				},
			},
			ReplyToAddresses: replyTo ? [replyTo] : undefined,
		});

		try {
			const sendWithTemplate: SendEmailCommandOutput = await this.sesClient.send<
				SendEmailCommandInput,
				SendEmailCommandOutput
			>(command);

			return sendWithTemplate;
		} catch (err: any) {
			this.logger.error(err);
			throw err;
		}
	}

	async sendBulk({
		recipients,
		sender,
		replyTo,
		bcc,
		cc,
		templateName,
	}: AwsSESSendBulkDto): Promise<SendBulkEmailCommandOutput> {
		const command: SendBulkEmailCommand = new SendBulkEmailCommand({
			FromEmailAddress: sender,
			DefaultContent: {
				Template: {
					TemplateName: templateName,
					TemplateData: JSON.stringify({}),
				},
			},
			BulkEmailEntries: recipients.map((recipient) => ({
				Destination: {
					ToAddresses: [recipient.recipient],
					BccAddresses: bcc ?? [],
					CcAddresses: cc ?? [],
				},
				ReplacementEmailContent: {
					ReplacementTemplate: {
						ReplacementTemplateData: JSON.stringify(recipient.templateData ?? {}),
					},
				},
			})),
			ReplyToAddresses: replyTo ? [replyTo] : undefined,
		});

		try {
			const sendWithTemplate: SendBulkEmailCommandOutput = await this.sesClient.send<
				SendBulkEmailCommandInput,
				SendBulkEmailCommandOutput
			>(command);

			return sendWithTemplate;
		} catch (err: any) {
			this.logger.error(err);
			throw err;
		}
	}
}
