import { Module } from "@nestjs/common";
import { PrismaModule } from "~/common/prisma/prisma.module";
import { HttpModule } from "@nestjs/axios";
import { ExchangeRateService } from "./exchange-rate.service";
import { ExchangeRateCron } from "./exchange-rate.cron";
import { ExchangeRatePublicController } from "./exchange-rate.controller";

@Module({
	imports: [PrismaModule, HttpModule],
	controllers: [ExchangeRatePublicController],
	providers: [ExchangeRateService, ExchangeRateCron],
	exports: [ExchangeRateService],
})
export class ExchangeRateModule {}
