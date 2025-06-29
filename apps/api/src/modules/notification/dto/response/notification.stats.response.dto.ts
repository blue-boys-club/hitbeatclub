import { createZodDto } from "nestjs-zod";
import { NotificationStatsResponseSchema } from "@hitbeatclub/shared-types";

export class NotificationStatsResponseDto extends createZodDto(NotificationStatsResponseSchema) {}
