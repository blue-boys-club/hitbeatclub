import { createZodDto } from "nestjs-zod";
import { QuestionDetailResponseSchema } from "@hitbeatclub/shared-types";

export class QuestionDetailResponseDto extends createZodDto(QuestionDetailResponseSchema) {}
