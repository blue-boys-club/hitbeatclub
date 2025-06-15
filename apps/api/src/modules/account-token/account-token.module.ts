import { Module } from "@nestjs/common";
import { AccountTokenService } from "./account-token.service";
import { AccountTokenCron } from "./account-token.cron";

@Module({
	controllers: [],
	providers: [AccountTokenService, AccountTokenCron],
	exports: [AccountTokenService],
})
export class AccountTokenModule {}
