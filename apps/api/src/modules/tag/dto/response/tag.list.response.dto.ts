import { createZodDto } from "nestjs-zod";
import { TagListResponseSchema } from "@hitbeatclub/shared-types/tag";

export class TagListResponseDto extends createZodDto(TagListResponseSchema) {}
