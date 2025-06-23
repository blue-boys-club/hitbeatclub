import { createZodDto } from "nestjs-zod";
import { InquiryUpdateSchema } from "@hitbeatclub/shared-types";

export class InquiryUpdateDto extends createZodDto(InquiryUpdateSchema) {}
