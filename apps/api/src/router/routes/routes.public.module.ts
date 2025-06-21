import { Module } from "@nestjs/common";
import { UserModule } from "~/modules/user/user.module";
import { AuthModule } from "~/modules/auth/auth.module";
import { AuthPublicController } from "~/modules/auth/auth.public.controller";
import { AccountTokenModule } from "~/modules/account-token/account-token.module";
import { EmailModule } from "~/modules/email/email.module";
import { NoticeModule } from "~/modules/notice/notice.module";
import { QuestionModule } from "~/modules/question/question.module";

@Module({
	controllers: [AuthPublicController],
	providers: [],
	exports: [],
	imports: [UserModule, AuthModule.forRoot(), AccountTokenModule, EmailModule, NoticeModule, QuestionModule],
})
export class RoutesPublicModule {}
