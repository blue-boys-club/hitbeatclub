import { createZodDto } from "nestjs-zod";
import { CouponValidateRequestSchema } from "@hitbeatclub/shared-types";

export class CouponValidateRequestDto extends createZodDto(CouponValidateRequestSchema) {}
