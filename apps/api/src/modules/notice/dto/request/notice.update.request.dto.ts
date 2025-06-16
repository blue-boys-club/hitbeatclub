import { createZodDto } from "nestjs-zod";
import { NoticeUpdateRequestSchema } from "@hitbeatclub/shared-types";

export class NoticeUpdateRequestDto extends createZodDto(NoticeUpdateRequestSchema) {}
