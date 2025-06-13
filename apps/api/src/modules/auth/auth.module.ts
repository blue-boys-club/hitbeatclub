import { DynamicModule, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthJwtAccessStrategy } from "./guards/jwt/strategies/auth.jwt.access.strategy";
import { AuthJwtRefreshStrategy } from "./guards/jwt/strategies/auth.jwt.refresh.strategy";
import { AuthPublicController } from "./auth.public.controller";
import { UserModule } from "../user/user.module";
import { AccountTokenModule } from "../account-token/account-token.module";

@Module({
	imports: [UserModule, AccountTokenModule],
	providers: [AuthService],
	exports: [AuthService],
	controllers: [AuthPublicController],
})
export class AuthModule {
	static forRoot(): DynamicModule {
		return {
			module: AuthModule,
			providers: [AuthJwtAccessStrategy, AuthJwtRefreshStrategy],
			exports: [],
			controllers: [],
			imports: [],
		};
	}
}
