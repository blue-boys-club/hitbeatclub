import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { SubscribeService } from "./subscribe.service";
import { ENUM_APP_TIMEZONE } from "~/app/constants/app.enum.constant";

@Injectable()
export class SubscribeCron {
	constructor(private readonly subscribeService: SubscribeService) {}

	@Cron(CronExpression.EVERY_DAY_AT_10AM, {
		name: "subscribeHandleDailyPayments",
		timeZone: process.env.APP_TIMEZONE ?? ENUM_APP_TIMEZONE.ASIA_SEOUL,
	})
	async handleDailyPayments() {
		await this.subscribeService.runScheduledPayments();
	}
}
