import { createZodDto } from "nestjs-zod";
import { PaymentCompleteRequestSchema } from "@hitbeatclub/shared-types/payment";

export class PaymentCompleteRequestDto extends createZodDto(PaymentCompleteRequestSchema) {}
