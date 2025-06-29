import { createZodDto } from "nestjs-zod";
import { NotificationCreateSchema } from "@hitbeatclub/shared-types";

export class NotificationCreateDto extends createZodDto(NotificationCreateSchema) {}
