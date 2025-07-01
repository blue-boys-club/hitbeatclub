// account-token.cron.ts
import { Cron, CronExpression } from "@nestjs/schedule";
import { Injectable, Logger } from "@nestjs/common";
import { AccountTokenService } from "./account-token.service";
import { ENUM_APP_TIMEZONE } from "~/app/constants/app.enum.constant";

@Injectable()
export class AccountTokenCron {
	private readonly logger = new Logger(AccountTokenCron.name);

	constructor(private readonly tokenService: AccountTokenService) {}

	/** 매일 새벽 3시, 휴지 토큰 soft-delete */
	@Cron(CronExpression.EVERY_DAY_AT_3AM, {
		name: "accountTokenCleanup",
		timeZone: process.env.APP_TIMEZONE ?? ENUM_APP_TIMEZONE.ASIA_SEOUL,
		disabled: !(process.env.CRON_ENABLED === "true"),
	})
	async handleCleanup() {
		const { count } = await this.tokenService.softDeleteGarbage(30);
		this.logger.debug(`Soft-deleted ${count} expired/inactive tokens`);
	}
}
