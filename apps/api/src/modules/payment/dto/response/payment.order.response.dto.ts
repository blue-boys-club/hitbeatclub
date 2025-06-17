import { createZodDto } from "nestjs-zod";
import { PaymentOrderResponseSchema } from "@hitbeatclub/shared-types/payment";

export class PaymentOrderResponseDto extends createZodDto(PaymentOrderResponseSchema) {}
