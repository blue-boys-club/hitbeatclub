import { createZodDto } from "nestjs-zod";
import { InquiryDetailResponseSchema } from "@hitbeatclub/shared-types";

export class InquiryDetailResponseDto extends createZodDto(InquiryDetailResponseSchema) {}
