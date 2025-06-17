import { createZodDto } from "nestjs-zod";
import { PaymentOrderCreateResponseSchema } from "@hitbeatclub/shared-types/payment";

export class PaymentOrderCreateResponseDto extends createZodDto(PaymentOrderCreateResponseSchema) {}
