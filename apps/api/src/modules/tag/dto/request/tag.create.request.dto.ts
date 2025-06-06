import { TagCreateRequestSchema } from "@hitbeatclub/shared-types";
import { createZodDto } from "nestjs-zod";

export class TagCreateDto extends createZodDto(TagCreateRequestSchema) {}
