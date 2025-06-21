import { createZodDto } from "nestjs-zod";
import { QuestionUpdateSchema } from "@hitbeatclub/shared-types";

export class QuestionUpdateDto extends createZodDto(QuestionUpdateSchema) {}
