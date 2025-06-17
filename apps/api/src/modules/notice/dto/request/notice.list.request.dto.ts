import { createZodDto } from "nestjs-zod";
import { NoticeListQueryRequestSchema } from "@hitbeatclub/shared-types";

export class NoticeListQueryRequestDto extends createZodDto(NoticeListQueryRequestSchema) {}
