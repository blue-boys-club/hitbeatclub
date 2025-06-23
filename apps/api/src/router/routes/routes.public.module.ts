import { Module } from "@nestjs/common";
import { UserModule } from "~/modules/user/user.module";
import { AuthModule } from "~/modules/auth/auth.module";
import { AuthPublicController } from "~/modules/auth/auth.public.controller";
import { AccountTokenModule } from "~/modules/account-token/account-token.module";
import { EmailModule } from "~/modules/email/email.module";
import { NoticeModule } from "~/modules/notice/notice.module";
import { QuestionModule } from "~/modules/question/question.module";
import { InquiryModule } from "~/modules/inquiry/inquiry.module";

@Module({
	controllers: [AuthPublicController],
	providers: [],
	exports: [],
	imports: [
		AuthModule.forRoot(),
		UserModule,
		AccountTokenModule,
		EmailModule,
		NoticeModule,
		QuestionModule,
		InquiryModule,
	],
})
export class RoutesPublicModule {}
