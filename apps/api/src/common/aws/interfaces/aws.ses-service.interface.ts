import {
	CreateEmailTemplateCommandOutput,
	DeleteEmailTemplateCommandOutput,
	GetEmailTemplateCommandOutput,
	ListEmailTemplatesCommandOutput,
	SendBulkEmailCommandOutput,
	SendEmailCommandOutput,
	UpdateEmailTemplateCommandOutput,
} from "@aws-sdk/client-sesv2";
import {
	AwsSESCreateTemplateDto,
	AwsSESGetTemplateDto,
	AwsSESSendBulkDto,
	AwsSESSendDto,
	AwsSESUpdateTemplateDto,
} from "~/common/aws/dtos/aws.ses.dto";

export interface IAwsSESService {
	listTemplates(nextToken?: string): Promise<ListEmailTemplatesCommandOutput>;
	getTemplate({ name }: AwsSESGetTemplateDto): Promise<GetEmailTemplateCommandOutput>;
	createTemplate({
		name,
		subject,
		htmlBody,
		plainTextBody,
	}: AwsSESCreateTemplateDto): Promise<CreateEmailTemplateCommandOutput>;
	updateTemplate({
		name,
		subject,
		htmlBody,
		plainTextBody,
	}: AwsSESUpdateTemplateDto): Promise<UpdateEmailTemplateCommandOutput>;
	deleteTemplate({ name }: AwsSESGetTemplateDto): Promise<DeleteEmailTemplateCommandOutput>;
	sendEmail<T>({
		subject,
		recipients,
		sender,
		replyTo,
		bcc,
		cc,
		htmlBody,
		textBody,
	}: AwsSESSendDto<T>): Promise<SendEmailCommandOutput>;
	send<T>({
		recipients,
		sender,
		replyTo,
		bcc,
		cc,
		templateName,
		templateData,
	}: AwsSESSendDto<T>): Promise<SendEmailCommandOutput>;
	sendBulk({
		recipients,
		sender,
		replyTo,
		bcc,
		cc,
		templateName,
	}: AwsSESSendBulkDto): Promise<SendBulkEmailCommandOutput>;
}
