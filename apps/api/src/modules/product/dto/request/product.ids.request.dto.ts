import { createZodDto } from "nestjs-zod";
import { ProductIdsRequestSchema } from "@hitbeatclub/shared-types/product";

export class ProductIdsRequestDto extends createZodDto(ProductIdsRequestSchema) {}
