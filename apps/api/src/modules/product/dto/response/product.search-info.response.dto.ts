import { createZodDto } from "nestjs-zod";
import { ProductSearchInfoResponseSchema } from "@hitbeatclub/shared-types/product";

export class ProductSearchInfoResponseDto extends createZodDto(ProductSearchInfoResponseSchema) {}
