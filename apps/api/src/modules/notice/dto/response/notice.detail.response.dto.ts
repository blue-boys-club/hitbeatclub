import { createZodDto } from "nestjs-zod";
import { NoticeDetailResponseSchema } from "@hitbeatclub/shared-types";

export class NoticeDetailResponseDto extends createZodDto(NoticeDetailResponseSchema) {}
