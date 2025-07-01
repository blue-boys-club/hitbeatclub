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
		disabled: !(process.env.CRON_ENABLED === "true"),
	})
	async handleUpdate() {
		try {
			// We store an exchange-rate row identified by (base: KRW, target: USD).
			// "rate" is the KRW amount required to purchase 1 USD (≒ USDT).
			const baseCurrency = "KRW";
			const targetCurrency = "USD";

			// CoinGecko USDT price endpoint
			const url = "https://api.coingecko.com/api/v3/simple/price?vs_currencies=krw&symbols=usdt";

			// Fetch latest USDT price in KRW
			const response = await firstValueFrom(
				this.httpService.get(url, {
					headers: {
						accept: "application/json",
					},
				}),
			);

			const priceKrwPerUsd: number | undefined = response.data?.usdt?.krw;

			if (!priceKrwPerUsd || isNaN(priceKrwPerUsd)) {
				this.logger.warn({ response: response.data }, "Failed to fetch exchange rate: invalid response");
				return;
			}

			// Apply 1% surcharge as requested (USDT is roughly pegged to USD)
			const adjustedKrwPerUsd = priceKrwPerUsd * 1.01;

			// Persist both directions:
			//   1) KRW → USD (rate: USD per KRW)
			//   2) USD → KRW (rate: KRW per USD)
			const usdPerKrw = 1 / adjustedKrwPerUsd;

			await this.exchangeRateService.updateExchangeRate("KRW", "USD", usdPerKrw);
			await this.exchangeRateService.updateExchangeRate("USD", "KRW", adjustedKrwPerUsd);
		} catch (error) {
			this.logger.error("Exchange rate cron failed", error);
		}
	}
}
