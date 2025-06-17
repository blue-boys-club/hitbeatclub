import { createZodDto } from "nestjs-zod";
import { NoticeCreateResponseSchema } from "@hitbeatclub/shared-types";

export class NoticeCreateResponseDto extends createZodDto(NoticeCreateResponseSchema) {}
