import { createZodDto } from "nestjs-zod";
import { SettlementUpdateSchema } from "@hitbeatclub/shared-types/settlement";

export class SettlementUpdateDto extends createZodDto(SettlementUpdateSchema) {}
