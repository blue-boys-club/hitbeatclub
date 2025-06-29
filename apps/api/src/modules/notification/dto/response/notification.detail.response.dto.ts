import { createZodDto } from "nestjs-zod";
import { NotificationDetailResponseSchema } from "@hitbeatclub/shared-types";

export class NotificationDetailResponseDto extends createZodDto(NotificationDetailResponseSchema) {}
