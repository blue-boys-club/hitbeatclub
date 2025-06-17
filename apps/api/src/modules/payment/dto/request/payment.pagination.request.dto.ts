import { PaginationRequestSchema } from "@hitbeatclub/shared-types/common";
import { createZodDto } from "nestjs-zod";

export class PaymentPaginationRequestDto extends createZodDto(PaginationRequestSchema) {}
