import { createZodDto } from "nestjs-zod";
import { ProductUpdateSchema } from "@hitbeatclub/shared-types/product";

export class ProductUpdateDto extends createZodDto(ProductUpdateSchema) {}
