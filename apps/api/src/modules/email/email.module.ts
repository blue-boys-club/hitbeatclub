import { Module, OnModuleInit, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EmailService } from "~/modules/email/services/email.service";
import { AwsModule } from "~/common/aws/aws.module";
import { EmailController } from "~/modules/email/controllers/email.controller";
import { AuthModule } from "~/modules/auth/auth.module";
import { AccountTokenModule } from "~/modules/account-token/account-token.module";
import { UserModule } from "~/modules/user/user.module";

@Module({
	imports: [AwsModule, AuthModule, AccountTokenModule, UserModule],
	providers: [EmailService],
	exports: [EmailService],
	controllers: [EmailController],
})
export class EmailModule implements OnModuleInit {
	private readonly logger = new Logger(EmailModule.name);

	constructor(
		private readonly emailService: EmailService,
		private readonly configService: ConfigService,
	) {}

	async onModuleInit() {
		const autoInitTemplates = this.configService.get<boolean>("email.autoInitTemplates", true);
		const appEnv = this.configService.get<string>("app.env", "development");

		if (autoInitTemplates) {
			console.log("autoInitTemplates", autoInitTemplates);
			try {
				this.logger.log(`Initializing email templates on module init for ${appEnv} environment...`);
				await this.emailService.initializeTemplates();
				this.logger.log("Email templates initialized successfully");
			} catch (error) {
				this.logger.warn("Failed to initialize email templates on startup:", error);
			}
		} else {
			this.logger.log("Template auto-initialization is disabled");
		}
	}
}
