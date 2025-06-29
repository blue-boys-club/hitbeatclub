import { createZodDto } from "nestjs-zod";
import { NotificationUpdateSchema } from "@hitbeatclub/shared-types";

export class NotificationUpdateDto extends createZodDto(NotificationUpdateSchema) {}
