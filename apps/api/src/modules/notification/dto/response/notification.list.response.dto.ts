import { createZodDto } from "nestjs-zod";
import { NotificationListResponseSchema } from "@hitbeatclub/shared-types";

export class NotificationListResponseDto extends createZodDto(NotificationListResponseSchema) {}
