import { createZodDto } from "nestjs-zod";
import { InquiryListResponseSchema } from "@hitbeatclub/shared-types";

export class InquiryListResponseDto extends createZodDto(InquiryListResponseSchema) {}
