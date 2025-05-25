import { Module } from "@nestjs/common";
import { UserModule } from "src/modules/user/user.module";
import { AuthModule } from "src/modules/auth/auth.module";
import { AuthPublicController } from "src/modules/auth/auth.public.controller";

@Module({
	controllers: [AuthPublicController],
	providers: [],
	exports: [],
	imports: [UserModule, AuthModule.forRoot()],
})
export class RoutesPublicModule {}
