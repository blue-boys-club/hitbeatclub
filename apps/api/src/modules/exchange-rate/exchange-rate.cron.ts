import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { ExchangeRateService } from "./exchange-rate.service";
import { ENUM_APP_TIMEZONE } from "~/app/constants/app.enum.constant";

@Injectable()
export class ExchangeRateCron {
	private readonly logger = new Logger(ExchangeRateCron.name);

	constructor(
		private readonly httpService: HttpService,
		private readonly exchangeRateService: ExchangeRateService,
	) {}

	/** 매시간 환율 업데이트 */
	@Cron(CronExpression.EVERY_HOUR, {
		name: "exchangeRateUpdate",
		timeZone: process.env.APP_TIMEZONE ?? ENUM_APP_TIMEZONE.ASIA_SEOUL,
	})
	async handleUpdate() {
		try {
			const baseCurrency = "KRW";
			const targetCurrency = "USD";

			// Example external API (exchangerate.host)
			const url = `https://api.exchangerate.host/convert?from=${baseCurrency}&to=${targetCurrency}`;
			const response = await firstValueFrom(this.httpService.get(url));

			const data: any = response.data;
			const rate: number = data?.result ?? null;

			if (!rate) {
				this.logger.warn("Failed to fetch exchange rate: invalid response");
				return;
			}

			await this.exchangeRateService.updateExchangeRate(baseCurrency, targetCurrency, rate);
		} catch (error) {
			this.logger.error("Exchange rate cron failed", error);
		}
	}
}
