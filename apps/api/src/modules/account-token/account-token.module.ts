import { Module } from "@nestjs/common";
import { AccountTokenService } from "./account-token.service";
import { AccountTokenCron } from "./account-token.cron";
import { AccountTokenCronController } from "./account-token.controller";

@Module({
	controllers: [AccountTokenCronController],
	providers: [AccountTokenService, AccountTokenCron],
	exports: [AccountTokenService],
})
export class AccountTokenModule {}
