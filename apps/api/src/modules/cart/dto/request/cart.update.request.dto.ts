import { CartUpdateRequestSchema } from "@hitbeatclub/shared-types/cart";
import { createZodDto } from "nestjs-zod";

export class CartUpdateRequestDto extends createZodDto(CartUpdateRequestSchema) {}
