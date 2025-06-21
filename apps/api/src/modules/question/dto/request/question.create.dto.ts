import { createZodDto } from "nestjs-zod";
import { QuestionCreateSchema } from "@hitbeatclub/shared-types";

export class QuestionCreateDto extends createZodDto(QuestionCreateSchema) {}
