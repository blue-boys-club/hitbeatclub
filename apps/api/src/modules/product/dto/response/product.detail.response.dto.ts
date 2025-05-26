import { createZodDto } from "nestjs-zod";
import { ProductDetailResponseSchema } from "@hitbeatclub/shared-types/product";

export class ProductDetailResponseDto extends createZodDto(ProductDetailResponseSchema) {}
