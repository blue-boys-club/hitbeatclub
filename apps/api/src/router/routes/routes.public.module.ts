import { Module } from "@nestjs/common";
import { UserModule } from "~/modules/user/user.module";
import { AuthModule } from "~/modules/auth/auth.module";
import { AuthPublicController } from "~/modules/auth/auth.public.controller";
import { AccountTokenModule } from "~/modules/account-token/account-token.module";
import { EmailModule } from "~/modules/email/email.module";

@Module({
	controllers: [AuthPublicController],
	providers: [],
	exports: [],
	imports: [UserModule, AuthModule.forRoot(), AccountTokenModule, EmailModule],
})
export class RoutesPublicModule {}
