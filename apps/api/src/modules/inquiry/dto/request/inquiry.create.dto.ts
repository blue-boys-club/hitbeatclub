import { createZodDto } from "nestjs-zod";
import { InquiryCreateSchema } from "@hitbeatclub/shared-types";

export class InquiryCreateDto extends createZodDto(InquiryCreateSchema) {}
