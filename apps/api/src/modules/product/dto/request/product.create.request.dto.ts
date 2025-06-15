import { createZodDto } from "nestjs-zod";
import { ProductCreateSchema } from "@hitbeatclub/shared-types/product";

export class ProductCreateDto extends createZodDto(ProductCreateSchema) {}
