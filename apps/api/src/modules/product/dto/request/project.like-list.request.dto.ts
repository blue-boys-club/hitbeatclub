import { createZodDto } from "nestjs-zod";
import { ProductListQuerySchema } from "@hitbeatclub/shared-types/product";

export class ProductListQueryRequestDto extends createZodDto(ProductListQuerySchema) {}
