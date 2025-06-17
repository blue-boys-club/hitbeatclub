import { createZodDto } from "nestjs-zod";
import { NoticeListResponseSchema } from "@hitbeatclub/shared-types";

export class NoticeListResponseDto extends createZodDto(NoticeListResponseSchema) {}
