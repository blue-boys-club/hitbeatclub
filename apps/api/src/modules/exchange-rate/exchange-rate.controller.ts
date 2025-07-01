import { Controller, Get, Logger, Query, Post, UnauthorizedException } from "@nestjs/common";
import { ApiOperation, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { ExchangeRateService } from "./exchange-rate.service";
import { IResponse } from "~/common/response/interfaces/response.interface";
import { ExchangeRateLatestResponseDto } from "./dto/response/exchange-rate.latest.response.dto";
import { ConfigService } from "@nestjs/config";
import { ExchangeRateCron } from "./exchange-rate.cron";

@Controller("exchange-rates")
@ApiTags("exchange-rate")
@ApiBearerAuth()
export class ExchangeRatePublicController {
	private readonly logger = new Logger(ExchangeRatePublicController.name);

	constructor(
		private readonly exchangeRateService: ExchangeRateService,
		private readonly configService: ConfigService,
		private readonly exchangeRateCron: ExchangeRateCron,
	) {}

	@Get()
	@ApiOperation({ summary: "환율 최신 정보 조회" })
	async findLatest(
		@Query("base") baseCurrency = "KRW",
		@Query("target") targetCurrency = "USD",
	): Promise<IResponse<ExchangeRateLatestResponseDto>> {
		const data = await this.exchangeRateService.findLatest(baseCurrency, targetCurrency);

		return {
			statusCode: 200,
			message: "success find exchange rate",
			data,
		};
	}

	/**
	 * 환율 업데이트 크론을 수동으로 실행합니다.
	 * secret 쿼리가 cronSecret과 일치해야 합니다.
	 */
	@Post("cron/update")
	@ApiOperation({ summary: "환율 업데이트 수동 실행" })
	async triggerUpdate(@Query("secret") secret: string): Promise<IResponse<void>> {
		if (secret !== this.configService.get<string>("app.cronSecret")) {
			throw new UnauthorizedException();
		}

		// Cron 클래스의 동일 로직을 사용해 환율을 업데이트합니다.
		await this.exchangeRateCron.handleUpdate();

		return { statusCode: 200, message: "trigger exchange rate cron succeeded" };
	}
}
