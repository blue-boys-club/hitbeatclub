import { createZodDto } from "nestjs-zod";
import { NoticeCreateRequestSchema } from "@hitbeatclub/shared-types";

export class NoticeCreateRequestDto extends createZodDto(NoticeCreateRequestSchema) {}
