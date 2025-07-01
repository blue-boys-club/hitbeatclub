import { Injectable, Logger, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "~/common/prisma/prisma.service";
import { EXCHANGE_RATE_FIND_ERROR, EXCHANGE_RATE_NOT_FOUND_ERROR } from "./exchange-rate.error";

@Injectable()
export class ExchangeRateService {
	private readonly logger = new Logger(ExchangeRateService.name);

	constructor(private readonly prisma: PrismaService) {}

	/**
	 * Get latest KRW \u2194 USD exchange rate.
	 */
	async findLatest(baseCurrency: string = "KRW", targetCurrency: string = "USD") {
		try {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			const latest = await this.prisma.exchangeRate
				.findFirst({
					where: {
						deletedAt: null,
						baseCurrency: baseCurrency.toUpperCase(),
						targetCurrency: targetCurrency.toUpperCase(),
					},
					orderBy: { createdAt: "desc" },
				})
				.then((data) => (data ? this.prisma.serializeBigInt(data) : null));

			if (!latest) {
				throw new NotFoundException(EXCHANGE_RATE_NOT_FOUND_ERROR);
			}

			return latest;
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}
			this.logger.error("환율 조회 중 오류 발생", error);
			throw new BadRequestException(EXCHANGE_RATE_FIND_ERROR);
		}
	}

	/**
	 * Save new exchange rate record.
	 */
	async updateExchangeRate(baseCurrency: string, targetCurrency: string, rate: number): Promise<void> {
		try {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore – exchangeRate model will exist after Prisma migration
			await this.prisma.exchangeRate.create({
				data: {
					baseCurrency: baseCurrency.toUpperCase(),
					targetCurrency: targetCurrency.toUpperCase(),
					rate,
				},
			});
			this.logger.debug(
				`Inserted exchange rate ${baseCurrency.toUpperCase()}->${targetCurrency.toUpperCase()}: ${rate}`,
			);
		} catch (error) {
			this.logger.error("환율 저장 중 오류 발생", error);
			throw new BadRequestException({
				statusCode: 400,
				message: "환율 저장에 실패했습니다.",
				error: "EXCHANGE_RATE_SAVE_ERROR",
			});
		}
	}
}
