import { CartListResponseSchema } from "@hitbeatclub/shared-types/cart";
import { createZodDto } from "nestjs-zod";

export class CartListResponseDto extends createZodDto(CartListResponseSchema) {}
