import { createZodDto } from "nestjs-zod";
import { SettlementResponseSchema } from "@hitbeatclub/shared-types/settlement";

export class SettlementDetailResponseDto extends createZodDto(SettlementResponseSchema as any) {}
