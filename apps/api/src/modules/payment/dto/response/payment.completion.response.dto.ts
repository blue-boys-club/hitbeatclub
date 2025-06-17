import { createZodDto } from "nestjs-zod";
import { PaymentCompletionResponseSchema } from "@hitbeatclub/shared-types/payment";

export class PaymentCompletionResponseDto extends createZodDto(PaymentCompletionResponseSchema) {}
