import { EmailSendPayloadSchema } from "@hitbeatclub/shared-types";
import { createZodDto } from "nestjs-zod";

export class EmailSendDto extends createZodDto(EmailSendPayloadSchema) {}
