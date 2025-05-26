import { createZodDto } from "nestjs-zod";
import { ProductListResponseSchema } from "@hitbeatclub/shared-types/product";

export class ProductListResponseDto extends createZodDto(ProductListResponseSchema) {}
