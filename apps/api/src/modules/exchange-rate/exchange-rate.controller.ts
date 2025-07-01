import { Controller, Get, Logger, Query } from "@nestjs/common";
import { ApiOperation, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { ExchangeRateService } from "./exchange-rate.service";
import { IResponse } from "~/common/response/interfaces/response.interface";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

// Zod schema & DTO for response
const ExchangeRateResponseSchema = z.object({
	id: z.string().describe("ID"),
	baseCurrency: z.string().describe("Base currency"),
	targetCurrency: z.string().describe("Target currency"),
	rate: z.number().describe("Exchange rate"),
	createdAt: z.string().datetime().describe("생성 일시"),
});

export class ExchangeRateResponseDto extends createZodDto(ExchangeRateResponseSchema) {}

@Controller("exchange-rates")
@ApiTags("exchange-rate")
@ApiBearerAuth()
export class ExchangeRatePublicController {
	private readonly logger = new Logger(ExchangeRatePublicController.name);

	constructor(private readonly exchangeRateService: ExchangeRateService) {}

	@Get()
	@ApiOperation({ summary: "환율 최신 정보 조회" })
	async findLatest(
		@Query("base") baseCurrency = "KRW",
		@Query("target") targetCurrency = "USD",
	): Promise<IResponse<ExchangeRateResponseDto>> {
		const data = await this.exchangeRateService.findLatest(baseCurrency, targetCurrency);

		return {
			statusCode: 200,
			message: "success find exchange rate",
			data,
		};
	}
}
