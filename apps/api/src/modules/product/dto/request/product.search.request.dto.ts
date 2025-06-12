import { createZodDto } from "nestjs-zod";
import { ProductSearchQuerySchema } from "@hitbeatclub/shared-types/product";

export class ProductSearchQueryRequestDto extends createZodDto(ProductSearchQuerySchema) {}
