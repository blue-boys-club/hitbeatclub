import { createZodDto } from "nestjs-zod";
import { SettlementCreateSchema } from "@hitbeatclub/shared-types/settlement";

export class SettlementCreateDto extends createZodDto(SettlementCreateSchema) {}
