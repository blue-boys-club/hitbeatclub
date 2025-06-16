import { createZodDto } from "nestjs-zod";
import { CouponValidateResponseSchema } from "@hitbeatclub/shared-types";

export class CouponValidateResponseDto extends createZodDto(CouponValidateResponseSchema) {}
