import { createZodDto } from "nestjs-zod";
import { NotificationListQuerySchema } from "@hitbeatclub/shared-types";

export class NotificationListQueryRequestDto extends createZodDto(NotificationListQuerySchema) {}
