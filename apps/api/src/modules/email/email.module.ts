import { Module, OnModuleInit, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EmailService } from "src/modules/email/services/email.service";
import { AwsModule } from "src/common/aws/aws.module";
import { EmailController } from "src/modules/email/controllers/email.controller";
import { AuthModule } from "src/modules/auth/auth.module";
import { AccountTokenModule } from "src/modules/account-token/account-token.module";
import { UserModule } from "src/modules/user/user.module";

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
