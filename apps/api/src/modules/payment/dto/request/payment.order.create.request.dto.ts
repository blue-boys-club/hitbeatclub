import { createZodDto } from "nestjs-zod";
import { PaymentOrderCreateRequestSchema } from "@hitbeatclub/shared-types/payment";

export class PaymentOrderCreateRequestDto extends createZodDto(PaymentOrderCreateRequestSchema) {}
