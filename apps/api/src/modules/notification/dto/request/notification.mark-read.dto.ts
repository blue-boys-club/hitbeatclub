import { createZodDto } from "nestjs-zod";
import { NotificationMarkAsReadSchema } from "@hitbeatclub/shared-types";

export class NotificationMarkAsReadDto extends createZodDto(NotificationMarkAsReadSchema) {}
