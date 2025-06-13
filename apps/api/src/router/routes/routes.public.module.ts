import { Module } from "@nestjs/common";
import { UserModule } from "src/modules/user/user.module";
import { AuthModule } from "src/modules/auth/auth.module";
import { AuthPublicController } from "src/modules/auth/auth.public.controller";
import { AccountTokenModule } from "src/modules/account-token/account-token.module";
import { EmailModule } from "src/modules/email/email.module";

@Module({
	controllers: [AuthPublicController],
	providers: [],
	exports: [],
	imports: [UserModule, AuthModule.forRoot(), AccountTokenModule, EmailModule],
})
export class RoutesPublicModule {}
