import { createZodDto } from "nestjs-zod";
import { ExchangeRateResponseSchema } from "@hitbeatclub/shared-types";

export class ExchangeRateLatestResponseDto extends createZodDto(ExchangeRateResponseSchema) {}
