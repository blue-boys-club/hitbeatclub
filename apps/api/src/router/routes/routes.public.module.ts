import { Module } from "@nestjs/common";
import { UserModule } from "src/modules/user/user.module";
import { EmailModule } from "src/modules/email/email.module";
import { AuthModule } from "src/modules/auth/auth.module";
import { AuthPublicController } from "src/modules/auth/auth.public.controller";

@Module({
	controllers: [AuthPublicController],
	providers: [],
	exports: [],
	imports: [UserModule, AuthModule.forRoot(), EmailModule],
})
export class RoutesPublicModule {}
