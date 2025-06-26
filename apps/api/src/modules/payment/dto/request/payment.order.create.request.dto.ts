// import { createZodDto } from "nestjs-zod";
import { PaymentOrderCreateRequestSchema } from "@hitbeatclub/shared-types/payment";
import { z } from "zod";

// export class PaymentOrderCreateRequestDto extends createZodDto(PaymentOrderCreateRequestSchema) {}
export type PaymentOrderCreateRequestDto = z.infer<typeof PaymentOrderCreateRequestSchema>;
