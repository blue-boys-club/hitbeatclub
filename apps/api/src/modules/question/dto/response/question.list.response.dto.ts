import { createZodDto } from "nestjs-zod";
import { QuestionListResponseSchema } from "@hitbeatclub/shared-types";

export class QuestionListResponseDto extends createZodDto(QuestionListResponseSchema) {}
