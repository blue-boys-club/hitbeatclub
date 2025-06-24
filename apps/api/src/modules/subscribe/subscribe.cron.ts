import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { SubscribeService } from "./subscribe.service";

@Injectable()
export class SubscribeCron {
	constructor(private readonly subscribeService: SubscribeService) {}

	@Cron(CronExpression.EVERY_DAY_AT_4AM)
	async handleDailyPayments() {
		await this.subscribeService.runScheduledPayments();
	}
}
