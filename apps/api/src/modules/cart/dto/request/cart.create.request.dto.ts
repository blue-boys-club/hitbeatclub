import { CartCreateRequestSchema } from "@hitbeatclub/shared-types/cart";
import { createZodDto } from "nestjs-zod";

export class CartCreateRequestDto extends createZodDto(CartCreateRequestSchema) {}
